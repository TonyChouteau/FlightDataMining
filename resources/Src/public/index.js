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

    const filter = new Filter();
    const display = new Display(filter);
})