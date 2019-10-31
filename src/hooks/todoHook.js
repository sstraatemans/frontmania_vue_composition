import { todoStorage, filters } from './../utils';
import { ref } from '@vue/composition-api';

export default state => {
  let newTodo = ref('');
  const addTodo = () => {
    var value = newTodo && newTodo.value.trim();
    if (!value) {
      return;
    }
    state.todos.push({
      id: todoStorage.uid++,
      title: value,
      completed: false,
    });
    newTodo.value = '';
  };

  const removeTodo = todo => {
    state.todos.splice(state.todos.indexOf(todo), 1);
  };

  const removeCompleted = () => {
    state.todos = filters.active(state.todos);
  };

  return {
    newTodo,
    addTodo,
    removeTodo,
    removeCompleted,
  };
};
