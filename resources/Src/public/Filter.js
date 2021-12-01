function Filter() {
    this.configUrl = "/config";

    this.$filter = $(".filter");
    this.$subFilter = $(".sub_filter");

    this.$rangeContainer = $(".range_container");
    this.$range = $(".range");
    this.$rangeLabel = $(".range_label");

    this.data = null;

    this.init();
};

Filter.prototype = {
    init: function () {
        fetch(this.configUrl)
            .then(r => r.json())
            .then(res => {
                this.data = res.data;
                this.populateSelects();
                this.initRange();
            });
    },

    makeOptions: function() {
        let options = "<option value=''>Pas de filtre</option>";
        for (let filter in this.data) {
            options += `<option value="${filter}">${filter}</option>`;
        }

        return options;
    },

    makeSubOptions: function(filter) {
        let options = "";
        for (let id in this.data[filter]) {
            const sub_filter = this.data[filter][id];
            options += `<option value="${sub_filter}">${sub_filter}</option>`;
        }

        return options;
    },

    populateSelects: function() {
        this.$filter.html(this.makeOptions());
        this.$filter.off();
        this.$filter.on("change click", e => {
            const val = $(e.target).val();
            if (val === "") {
                this.$subFilter.hide();
                this.$rangeContainer.hide();
            } else {
                this.$rangeContainer.show();
                this.$subFilter.html(this.makeSubOptions(val)).show();
            }
        });
    },

    initRange: function() {
         this.$range.on("change click", e => {
            const val = $(e.target).val();
            $(".range_value", this.$rangeLabel).html(val);
        });
    },

    getFilter: function() {
        if (this.$filter.val()) {
            return {
                filter: this.$filter.val(),
                subFilter: this.$subFilter.val(),
                value: this.$range.val(),
            };
        }
        return null;
    }
};