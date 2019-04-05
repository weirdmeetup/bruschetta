import { Checkbox, Col, Divider, Row, Tag } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import React, { PureComponent } from 'react';

import { isEmpty } from '../../../utils/util';
import { EN_ISSUE_TYPE } from '../interface/EN_ISSUE_TYPE';
import { IIssueWithID } from '../interface/IIssue';

const taskPtn = /^\[( |x|X)\]/;
const doneTaskPtn = /^\[(x|X)\]/;
const epicPtn = /^# /;

type TProps = IIssueWithID & {
  /** 진척율 */
  progress?: number;
  handleChecked?(params: { e: CheckboxChangeEvent; id: string }): void;
};

export default class TodoIssueItem extends PureComponent<TProps> {
  constructor(props: IIssueWithID) {
    super(props);

    this.convertText = this.convertText.bind(this);
    this.haveCheckBox = this.haveCheckBox.bind(this);
    this.getProgress = this.getProgress.bind(this);
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

  private getProgress() {
    if (
      isEmpty(this.props.progress) ||
      this.props.type === EN_ISSUE_TYPE.DESC
    ) {
      return null;
    }
    const progress = (() => {
      if (this.props.progress === undefined) {
        return 0;
      }
      return this.props.progress;
    })();
    const color = (() => {
      if (progress < 30) {
        return ''; // none
      }
      if (progress < 60) {
        return '#d04437'; // red
      }
      if (progress < 90) {
        return '#f6c342'; // yellew
      }
      return '#14892c'; // green
    })();
    return (
      <Tag color={color} style={{ marginLeft: '8px' }}>{`${
        this.props.progress
      } %`}</Tag>
    );
  }

  public render() {
    const offset = this.props.depth;
    const displayText = this.convertText();
    const progress = this.getProgress();
    const text =
      this.props.type === EN_ISSUE_TYPE.EPIC ? (
        <h2>{displayText}</h2>
      ) : (
        displayText
      );
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
          {text}
          {progress}
        </Col>
        <Divider style={{ margin: '12px 0 4px' }} />
      </Row>
    );
  }
}
