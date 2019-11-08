import { todoStorage, filters } from './../utils';
import { ref, reactive, computed, watch } from '@vue/composition-api';

export default visibility => {
  const state = reactive({ todos: todoStorage.fetch() });
  let newTodo = ref('');
  const filteredTodos = computed(() => {
    return filters[visibility.value](state.todos);
  });

  const remaining = computed(() => {
    return filters.active(state.todos).length;
  });

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

  watch(() => todoStorage.save(state.todos));

  return {
    newTodo,
    addTodo,
    removeTodo,
    removeCompleted,
    filteredTodos,
    remaining,
  };
};
