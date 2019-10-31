<template>
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input
        class="new-todo"
        autofocus
        autocomplete="off"
        placeholder="What needs to be done?"
        v-model="newTodo"
        @keyup.enter="addTodo"
      />
    </header>
    <section class="main" v-show="todos.length" v-cloak>
      <ul class="todo-list">
        <li
          v-for="todo in filteredTodos"
          class="todo"
          :key="todo.id"
          :class="{ completed: todo.completed }"
        >
          <div class="view">
            <input class="toggle" type="checkbox" v-model="todo.completed" />
            <label>{{ todo.title }}</label>
            <button class="destroy" @click="removeTodo(todo)"></button>
          </div>
        </li>
      </ul>
    </section>
    <footer class="footer" v-show="todos.length" v-cloak>
      <span class="todo-count">
        <strong>{{ remaining }}</strong>
        items left
      </span>
      <ul class="filters">
        <li>
          <a @click="filterAll" :class="{ selected: visibility == 'all' }">All</a>
        </li>
        <li>
          <a @click="filterActive" :class="{ selected: visibility == 'active' }">Active</a>
        </li>
        <li>
          <a @click="filterCompleted" :class="{ selected: visibility == 'completed' }">Completed</a>
        </li>
      </ul>
      <button
        class="clear-completed"
        @click="removeCompleted"
        v-show="todos.length > remaining"
      >Clear completed</button>
    </footer>
  </section>
</template>

<script>
import { todoStorage, filters } from './utils';
import filterHook from './hooks/filterHook';
import todoHook from './hooks/todoHook';
import { reactive, computed, watch } from '@vue/composition-api';

export default {
  name: 'app',
  setup() {
    const state = reactive({ todos: todoStorage.fetch() });
    const {
      visibility,
      filterAll,
      filterActive,
      filterCompleted,
    } = filterHook();

    const { newTodo, addTodo, removeTodo, removeCompleted } = todoHook(state);

    const filteredTodos = computed(() => {
      return filters[visibility.value](state.todos);
    });

    const remaining = computed(() => {
      return filters.active(state.todos).length;
    });

    watch(() => todoStorage.save(state.todos));

    return {
      newTodo,
      visibility,
      todos: state.todos,
      filteredTodos,
      remaining,
      addTodo,
      removeTodo,
      removeCompleted,
      filterAll,
      filterActive,
      filterCompleted,
    };
  },
};
</script>
