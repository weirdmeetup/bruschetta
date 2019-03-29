import { Checkbox, Col, Divider, Row } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import React, { PureComponent } from 'react';

import { IIssueWithID } from '../interface/IIssue';

const taskPtn = /^\[( |x|X)\]/;
const doneTaskPtn = /^\[(x|X)\]/;
const epicPtn = /^# /;

type TProps = IIssueWithID & {
  handleChecked?(params: { e: CheckboxChangeEvent; id: string }): void;
};

export default class TodoIssueItem extends PureComponent<TProps> {
  constructor(props: IIssueWithID) {
    super(props);

    this.convertText = this.convertText.bind(this);
    this.haveCheckBox = this.haveCheckBox.bind(this);
  }

  private convertText() {
    if (epicPtn.test(this.props.text)) {
      return this.props.text.replace(epicPtn, '');
    }
    if (taskPtn.test(this.props.text)) {
      return this.props.text.replace(taskPtn, '');
    }
    return this.props.text;
  }

  /** [checkbox 보유 여부, checkbox 상태] */
  private haveCheckBox(): [boolean, boolean] {
    if (taskPtn.test(this.props.text)) {
      return [true, doneTaskPtn.test(this.props.text)];
    }
    return [false, false];
  }

  public render() {
    const offset = this.props.depth;
    // text 처리
    // 1. type이 epic이면 h 태그로 넣는다.
    // 2. type이 task 이면 체크 박스를 넣는다.
    // 2-1. 체크박스는 [x], [X]이면 기 체크된 상태로 변경한다.
    // 2-2. 체크박스를 클릭하면 체크 상태가 변경된다.
    const displayText = this.convertText();
    const [haveCheckBox, checkBoxValue] = this.haveCheckBox();
    const checkBox = haveCheckBox ? (
      <Checkbox
        checked={checkBoxValue}
        onChange={e => {
          if (this.props.handleChecked) {
            this.props.handleChecked({ e, id: this.props.id });
          }
        }}
      />
    ) : null;
    return (
      <Row style={{ marginTop: '8px' }}>
        <Col offset={offset}>
          {checkBox}
          {displayText}
        </Col>
        <Divider style={{ margin: '12px 0 4px' }} />
      </Row>
    );
  }
}
