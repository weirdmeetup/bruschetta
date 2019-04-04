import { Checkbox, Col, Divider, Row } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import React, { PureComponent } from 'react';

import { EN_ISSUE_TYPE } from '../interface/EN_ISSUE_TYPE';
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
    const displayText = this.convertText();
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
        </Col>
        <Divider style={{ margin: '12px 0 4px' }} />
      </Row>
    );
  }
}
