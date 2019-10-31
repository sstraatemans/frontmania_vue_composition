export default {
    methods: {
        filterAll: function() {
            this.visibility = 'all';
        },
        filterActive: function() {
            this.visibility = 'active';
        },
        filterCompleted: function() {
            this.visibility = 'completed';
        },
    }
};
