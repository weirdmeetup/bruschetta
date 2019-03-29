import Home from './components/home/Home';
import TodoContainer from './components/todo/container';

export default [
  {
    path: '/',
    exact: true,
    component: Home
  },
  {
    path: '/todo',
    exact: true,
    component: TodoContainer
  }
];
