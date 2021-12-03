const COLOR = [
    "#f34747",
    "#ec773f",
    "#d9bb45",
    "#80e757",
    "#2583ab",
    "#a533e8"
];

$(document).ready(() => {
    const ACTIVE = "active";

    const $nav = $(".nav_link");
    const $pages = $(".page");

    $nav.on("click", (e) => {
        const $btn = $(e.target);

        $nav.removeClass(ACTIVE);
        $btn.addClass(ACTIVE);

        $pages.removeClass(ACTIVE).filter(`[data-page=${$btn.data("page")}]`).addClass(ACTIVE);
    });

    const filter = new Filter(".view");
    const display = new Display(filter);

    const compareFilter1 = new Filter(".compare_f1");
    const compareFilter2 = new Filter(".compare_f2");
    const compare = new Compare(compareFilter1, compareFilter2);

    const assocFilter1 = new Filter(".assoc_f1")
    const assocFilter2 = new Filter(".assoc_f2");
    const assoc = new Assoc(assocFilter1, assocFilter2);
})