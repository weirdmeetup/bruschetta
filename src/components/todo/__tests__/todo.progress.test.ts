import 'jest';

import { EN_ISSUE_TYPE } from '../interface/EN_ISSUE_TYPE';
import { IIssueWithID } from '../interface/IIssue';
import { calProgress } from '../services/cal_progress';

/*
4 epic, 3 depth
desc 1
# epic (1)
[ ] parent 1 (1)
  [ ] child
  [x] child
[x] parent 2 (1)
  [ ] child
  [x] child (1)
    [x] child
  [ ] child
# epic (2)
  [x] parent 2_1
  [x] parent 2_2
# epic (1)
[x] parent 3_1
 */

const mock: IIssueWithID[] = [
  { id: 'desc01', text: 'desc', type: EN_ISSUE_TYPE.EPIC, depth: 0 },
  { id: 'epic01', text: '# epic', type: EN_ISSUE_TYPE.EPIC, depth: 0 },
  { id: 'parent01', text: '[ ] parent 1', type: EN_ISSUE_TYPE.TASK, depth: 0 },
  { id: 'p01_c01', text: '[ ] child', type: EN_ISSUE_TYPE.TASK, depth: 1 },
  { id: 'p01_c02', text: '[x] child', type: EN_ISSUE_TYPE.TASK, depth: 1 },
  { id: 'parent02', text: '[x] parent 2', type: EN_ISSUE_TYPE.TASK, depth: 0 },
  { id: 'p02_c01', text: '[ ] child', type: EN_ISSUE_TYPE.TASK, depth: 1 },
  { id: 'p02_c02', text: '[x] child', type: EN_ISSUE_TYPE.TASK, depth: 1 },
  { id: 'p02_c02_c01', text: '[x] child', type: EN_ISSUE_TYPE.TASK, depth: 2 },
  { id: 'p02_c03', text: '[ ] child', type: EN_ISSUE_TYPE.TASK, depth: 1 },
  { id: 'epic02', text: '# epic', type: EN_ISSUE_TYPE.EPIC, depth: 0 },
  {
    id: 'parent02_01',
    text: '[x] parent 2_1',
    type: EN_ISSUE_TYPE.TASK,
    depth: 1
  },
  {
    id: 'parent02_02',
    text: '[x] parent 2_2',
    type: EN_ISSUE_TYPE.TASK,
    depth: 1
  },
  { id: 'epic03', text: '# epic', type: EN_ISSUE_TYPE.EPIC, depth: 0 },
  {
    id: 'parent03_01',
    text: '[x] parent 3_1',
    type: EN_ISSUE_TYPE.TASK,
    depth: 0
  }
];

describe('진행율 계산 테스트', () => {
  test('계산 테스트 - epic01 (total2, done1)', done => {
    const result = calProgress(mock);
    const testData = result.get('epic01');
    expect(testData).toBeTruthy();
    expect(testData!.total).toEqual(2);
    expect(testData!.done).toEqual(1);
    done();
  });
  test('계산 테스트 - epic02 (total2, done2)', done => {
    const result = calProgress(mock);
    const testData = result.get('epic02');
    expect(testData).toBeTruthy();
    expect(testData!.total).toEqual(2);
    expect(testData!.done).toEqual(2);
    done();
  });
  test('계산 테스트 - epic03 (total1, done1)', done => {
    const result = calProgress(mock);
    const testData = result.get('epic03');
    expect(testData).toBeTruthy();
    expect(testData!.total).toEqual(1);
    expect(testData!.done).toEqual(1);
    done();
  });
  test('계산 테스트 - parent01 (total2, done1)', done => {
    const result = calProgress(mock);
    const testData = result.get('parent01');
    expect(testData).toBeTruthy();
    expect(testData!.total).toEqual(2);
    expect(testData!.done).toEqual(1);
    done();
  });
  test('계산 테스트 - parent02 (total3, done1)', done => {
    const result = calProgress(mock);
    const testData = result.get('parent02');
    expect(testData).toBeTruthy();
    expect(testData!.total).toEqual(3);
    expect(testData!.done).toEqual(1);
    done();
  });
  test('계산 테스트 - p02_c02_c01 (total0, done0)', done => {
    const result = calProgress(mock);
    const testData = result.get('p02_c02_c01');
    expect(testData).toBeTruthy();
    expect(testData!.total).toEqual(0);
    expect(testData!.done).toEqual(0);
    done();
  });
});
