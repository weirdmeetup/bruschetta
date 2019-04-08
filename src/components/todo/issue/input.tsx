import { Col, Icon, Input, Row } from 'antd';
import { produce } from 'immer';
import React, { FunctionComponent, useState } from 'react';

import { isEmpty } from '../../../utils/util';
import { EN_ISSUE_TYPE } from '../interface/EN_ISSUE_TYPE';
import { IIssue, IIssueWithID } from '../interface/IIssue';

interface IProps {
  upsideDepth: number;
  /** 입력 완료 액션 처리 */
  handleDone?(data: IIssue): IIssueWithID & { upsideDepth: number } | null;
  /** tab을 사용해서 depth */
  handleChangeDepth?(): void;
  /** 위/아래로 이동했을 때 사용하는 메서드 */
  handleGoUpsideOrDownside?(args: {
    data: IIssue;
    upside: boolean;
  }): IIssueWithID & { upsideDepth: number } | null;
}

interface IStates {
  text: string;
  type: EN_ISSUE_TYPE;
  depth: number;
  currentDepth: number;
}

function getType(text: string): EN_ISSUE_TYPE {
  if (/^# /.test(text)) {
    return EN_ISSUE_TYPE.EPIC;
  }
  if (/^\[( |x|X)\]/.test(text)) {
    return EN_ISSUE_TYPE.TASK;
  }
  return EN_ISSUE_TYPE.DESC;
}

/** 입력 변경에 따른 비지니스를 넣는다. */
function onInputChange({
  event,
  old,
  setState
}: {
  event: React.FormEvent<HTMLInputElement>;
  old: IStates;
  setState: React.Dispatch<React.SetStateAction<IStates>>;
}) {
  const current = event.currentTarget.value;
  const updateState = produce(old, draft => {
    const type = getType(current);
    draft.text = current;
    draft.type = type;
    if (type === EN_ISSUE_TYPE.EPIC) {
      draft.currentDepth = 0;
      draft.depth = 0;
    }
  });
  setState(updateState);
}

function getCheckBox({ type, text }: IStates) {
  if (isEmpty(type)) {
    return <Icon type="border" />;
  }
  if (type !== EN_ISSUE_TYPE.TASK) {
    return <Icon type={type === EN_ISSUE_TYPE.EPIC ? 'fire' : 'ellipsis'} />;
  }
  // text start가 x가 있는지 확인하자.
  if (/^\[(x|X)\]/.test(text)) {
    return <Icon type="check-square" />;
  }
  return <Icon type="border" />;
}

// epic은 체크 박스가 없다.
// desc는 체크 박스가 없다.
// epic은 복수의 task와 desc를 가질 수 있다.
// task는 desc와 task를 가질 수 있다.

export const TodoIssueInput: FunctionComponent<IProps> = props => {
  const [old, setState] = useState<IStates>({
    depth: props.upsideDepth,
    text: '',
    type: EN_ISSUE_TYPE.DESC,
    currentDepth: 0
  });
  const checkBox = getCheckBox({ ...old });
  return (
    <div>
      <Row type="flex" align="middle">
        <Col offset={old.depth}>
          <Input
            key="only_input"
            addonBefore={checkBox}
            size="large"
            placeholder="To-do"
            value={old.text}
            onKeyDown={event => {
              // 위/아래 화살표 입력 시
              if (
                (event.keyCode === 38 || event.keyCode === 40) &&
                !!props.handleGoUpsideOrDownside
              ) {
                const data = props.handleGoUpsideOrDownside({
                  data: old,
                  upside: event.keyCode === 38
                });
                if (data !== null) {
                  const updateState = produce(old, draft => {
                    draft.text = data.text;
                    draft.currentDepth = data.upsideDepth;
                    draft.depth = data.depth;
                    draft.type = data.type;
                  });
                  setState(updateState);
                }
                return;
              }
              // enter key 입력 시 입력 완료 처리
              if (event.keyCode === 13) {
                if (!!props.handleDone && old.text.length > 0) {
                  const data = props.handleDone({ ...old });
                  if (data === null) {
                    const renewState = produce(old, draft => {
                      // text를 삭제한다.
                      draft.text = '';
                      // task 일때만 앞에 3글자를 살린다.
                      if (old.type === EN_ISSUE_TYPE.TASK) {
                        draft.text = old.text.slice(0, 3);
                      }
                      if (draft.currentDepth < old.depth) {
                        draft.currentDepth = old.depth;
                      }
                      if (draft.depth === 0) {
                        draft.currentDepth = 0;
                      }
                    });
                    setState(renewState);
                    return;
                  }
                  const updateState = produce(old, draft => {
                    draft.text = data.text;
                    draft.currentDepth = data.upsideDepth;
                    draft.depth = data.depth;
                    draft.type = data.type;
                  });
                  setState(updateState);
                }
                return;
              }
              // shift + tab 일 때 depth 제거
              if (event.keyCode === 9 && event.shiftKey) {
                event.preventDefault();
                if (old.depth === 0) {
                  return;
                }
                const updateState = produce(old, draft => {
                  draft.depth -= 1;
                });
                setState(updateState);
                return;
              }
              // tab 키 입력 시 한 depth 넣어야함.
              if (event.keyCode === 9) {
                event.preventDefault();
                const updateState = produce(old, draft => {
                  // 깊이를 계속 가지고 들어갈 순 없다. 바로 위 depth에서 +1 한 수준으로 유지하자.
                  draft.depth = draft.currentDepth + 1;
                });
                setState(updateState);
                return;
              }
            }}
            onInput={event => {
              onInputChange({ event, old, setState });
            }}
          />
        </Col>
      </Row>
    </div>
  );
};
