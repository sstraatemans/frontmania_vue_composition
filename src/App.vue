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
import filterMixin from './mixins/filterMixin';
import { ref, reactive } from '@vue/composition-api';

export default {
  name: 'app',
  setup() {
    const newTodo = ref('');
    const visibility = ref('all');
    const state = reactive({ todos: todoStorage.fetch() });

    return {
      newTodo,
      visibility,
      todos: state.todos,
    };
  },

  mixins: [filterMixin],

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
  methods: {
    addTodo: function() {
      var value = this.newTodo && this.newTodo.trim();
      if (!value) {
        return;
      }
      this.todos.push({
        id: todoStorage.uid++,
        title: value,
        completed: false,
      });
      this.newTodo = '';
    },

    removeTodo: function(todo) {
      this.todos.splice(this.todos.indexOf(todo), 1);
    },

    removeCompleted: function() {
      this.todos = filters.active(this.todos);
    },
  },
  // computed properties
  // http://vuejs.org/guide/computed.html
  computed: {
    filteredTodos: function() {
      return filters[this.visibility](this.todos);
    },
    remaining: function() {
      return filters.active(this.todos).length;
    },
  },
};
</script>
