function Filter(container) {
    this.configUrl = "/config";

    container = container || "body";

    this.$filter = $(".filter", container);
    this.$subFilter = $(".sub_filter", container);

    this.$rangeContainer = $(".range_container", container);
    this.$range = $(".range", container);
    this.$rangeLabel = $(".range_label", container);
    this.$refresh = $(".refresh", container);

    this.filterCallback = null;

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
            const $f = $(e.target);
            if (this.filterCallback) {
                this.filterCallback(e);
            }
            if ($f.val() === "") {
                $f.siblings(".range_container").hide();
                $f.siblings(".sub_filter").hide();
            } else {
                $f.siblings(".range_container").show();
                $f.siblings(".sub_filter").html(this.makeSubOptions($f.val())).show();
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
    },

    getParams: function(filters) {
        return filters ? ("?" + Object.entries(filters).map(key_value =>
            key_value[0] + "=" + key_value[1]).join("&")
        ) : "";
    }
};