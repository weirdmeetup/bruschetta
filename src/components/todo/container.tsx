import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { produce } from 'immer';
import { observer } from 'mobx-react';
import React, { Component } from 'react';

import { isEmpty } from '../../utils/util';
import { IIssue, IIssueWithID } from './interface/IIssue';
import { TodoIssueInput } from './issue/input';
import TodoIssueItem from './issue/item';
import { calProgress } from './services/cal_progress';
import { TodoStore } from './store';

interface IStates {
  /** input이 현재 어느 위치에 있는지 기억한다. */
  inputIdx: number;
}

@observer
class TodoContainer extends Component<{}, IStates> {
  private store: TodoStore;

  constructor(props: object) {
    super(props);

    this.state = {
      inputIdx: 0
    };

    this.store = new TodoStore({ issues: [] });

    this.addIssue = this.addIssue.bind(this);
    this.handleChecked = this.handleChecked.bind(this);
    this.handleGoUpsideOrDownside = this.handleGoUpsideOrDownside.bind(this);
    this.getIssueList = this.getIssueList.bind(this);
  }

  protected addIssue(
    data: IIssue
  ): IIssueWithID & { upsideDepth: number } | null {
    const updateState = produce(this.state, draft => {
      draft.inputIdx =
        this.store.Issues.length === this.state.inputIdx
          ? this.store.Issues.length + 1
          : this.state.inputIdx + 1;
    });
    this.setState(updateState);
    if (
      this.state.inputIdx !== 0 &&
      this.state.inputIdx < this.store.Issues.length
    ) {
      // 이건 업데이트 각이다.
      const oldData = this.store.Issues[this.state.inputIdx];
      this.store.modifyIssue({ ...data, id: oldData.id });
      // 다음 데이터를 넘긴다.
      const nextIdx = this.state.inputIdx + 1;
      return nextIdx < this.store.Issues.length
        ? { ...this.store.Issues[nextIdx], upsideDepth: data.depth }
        : null;
    }
    this.store.addIssue(data);
    return null;
  }

  protected handleChecked(params: { e: CheckboxChangeEvent; id: string }) {
    this.store.checkedIssue(params.id);
  }

  protected handleGoUpsideOrDownside({
    data,
    upside
  }: {
    data: IIssue;
    upside: boolean;
  }): IIssueWithID & { upsideDepth: number } | null {
    if (
      (this.state.inputIdx === 0 && this.store.Issues.length === 0) ||
      isEmpty(this.store) ||
      isEmpty(this.store.Issues) ||
      this.store.Issues.length === 0
    ) {
      return null;
    }

    // store에 데이터 반영
    if (this.state.inputIdx < this.store.Issues.length) {
      const oldData = this.store.Issues[this.state.inputIdx];
      this.store.modifyIssue({ ...data, id: oldData.id });
    }

    // setState로 idx를 올리거나 내린다.
    let targetIdx = upside ? this.state.inputIdx - 1 : this.state.inputIdx + 1;
    if (targetIdx > this.store.Issues.length) {
      targetIdx = this.store.Issues.length;
    }
    const updateState = produce(this.state, draft => {
      draft.inputIdx = targetIdx;
    });
    this.setState(updateState);

    // 데이터 전달
    const returnData: IIssueWithID & { upsideDepth: number } = {
      ...this.store.Issues[targetIdx],
      upsideDepth: targetIdx === 0 ? 0 : this.store.Issues[targetIdx - 1].depth
    };
    return !!returnData ? returnData : null;
  }

  private getIssueList() {
    if (
      isEmpty(this.store) ||
      isEmpty(this.store.Issues) ||
      this.store.Issues.length === 0
    ) {
      return (
        <TodoIssueInput
          key="unique_input"
          upsideDepth={0}
          handleDone={this.addIssue}
        />
      );
    }
    const progressMap = calProgress([...this.store.Issues]);
    const issueItems = this.store.Issues.map((mv, idx) => {
      const progress = progressMap.get(mv.id);
      const progressValue =
        !!progress && progress.total > 0
          ? Math.floor((progress.done / progress.total) * 100)
          : undefined;

      // 현재 idx가 입력 idx와 같으면!! input 창을 넣는다.
      if (idx === this.state.inputIdx) {
        const upsideDepth = (() => {
          if (idx === 0) {
            return 0;
          }
          const upsideData = this.store.Issues[idx - 1];
          return upsideData.depth;
        })();
        return (
          <TodoIssueInput
            key="unique_input"
            upsideDepth={upsideDepth}
            handleDone={this.addIssue}
            handleGoUpsideOrDownside={this.handleGoUpsideOrDownside}
          />
        );
      }

      return (
        <TodoIssueItem
          key={mv.id}
          handleChecked={this.handleChecked}
          progress={progressValue}
          {...mv}
        />
      );
    });
    if (this.store.Issues.length === this.state.inputIdx) {
      issueItems.push(
        <TodoIssueInput
          key="unique_input"
          upsideDepth={0}
          handleDone={this.addIssue}
          handleGoUpsideOrDownside={this.handleGoUpsideOrDownside}
        />
      );
    }
    return issueItems;
  }

  public render() {
    const displayIssueList = this.getIssueList();
    return (
      <div>
        <>{displayIssueList}</>
      </div>
    );
  }
}

export default TodoContainer;
