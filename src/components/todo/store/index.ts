import { action, observable, runInAction } from 'mobx';

import { IIssue, IIssueWithID } from '../interface/IIssue';

export class TodoStore {
  @observable
  private issues: IIssueWithID[];
  constructor({ issues }: { issues: IIssueWithID[] }) {
    this.issues = issues;
  }

  get Issues(): IIssueWithID[] {
    return this.issues;
  }

  @action
  public addIssue(issue: IIssue) {
    return runInAction(() => {
      const id: string = `id_${this.issues.length}`;
      const updateIssue: IIssueWithID = { ...issue, id };
      this.issues.push(updateIssue);
      return updateIssue;
    });
  }

  @action
  public modifyIssue(issue: IIssueWithID) {
    const findIssueIdx = this.issues.findIndex(fv => fv.id === issue.id);
    // 데이터가 있다.
    if (findIssueIdx >= 0) {
      return runInAction(() => {
        this.issues[findIssueIdx] = issue;
        return this.issues;
      });
    }
    // 데이터가 없다.
    return runInAction(() => {
      this.addIssue(issue);
      return this.issues;
    });
  }

  @action
  public deleteIssue(id: string) {
    const findIssueIdx = this.issues.findIndex(fv => fv.id === id);
    // 데이터가 있다.
    if (findIssueIdx >= 0) {
      return runInAction(() => {
        // 해당 인덱스를 뽑아버려야한다.
        this.issues.splice(findIssueIdx, 1);
        return this.issues;
      });
    }
    // 데이터가 없다. 그냥 반환이나 하자.
    return this.issues;
  }
}
