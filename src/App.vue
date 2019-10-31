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
import { ref, reactive, computed } from '@vue/composition-api';

export default {
  name: 'app',
  setup() {
    let newTodo = ref('');
    const visibility = ref('all');
    let todos = reactive(todoStorage.fetch());
    const filteredTodos = computed(() => {
      return filters[visibility.value](todos);
    });
    const remaining = computed(() => {
      return filters.active(todos).length;
    });

    const addTodo = () => {
      var value = newTodo && newTodo.value.trim();
      if (!value) {
        return;
      }
      todos.push({
        id: todoStorage.uid++,
        title: value,
        completed: false,
      });
      newTodo.value = '';
    };

    const removeTodo = todo => {
      todos.splice(todos.indexOf(todo), 1);
    };

    const removeCompleted = () => {
      todos = filters.active(todos);
    };

    const filterAll = () => {
      visibility.value = 'all';
    };
    const filterActive = () => {
      visibility.value = 'active';
    };
    const filterCompleted = () => {
      visibility.value = 'completed';
    };

    return {
      newTodo,
      visibility,
      todos,
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

  // watch todos change for localStorage persistence
  watch: {
    todos: {
      handler: function(todos) {
        todoStorage.save(todos);
      },
    },
  },

  // methods that implement data logic.
  // note there's no DOM manipulation here at all.
  methods: {},
};
</script>
