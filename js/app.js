
$(document).ready(function() {

    // SETTINGS
    const categories = {
        goodbye: ["さよなら", "#e8d4d7", "☁"],
        thanks: ["ありがとう", "#dce5cc", "✿"],
        sorry: ["ごめんなさい", "#ead8ca", "＊"],
        love: ["好きでした", "#e4d8ed", "♡"],
        miss: ["会いたい", "#d2e3e6", "☾"],
        myself: ["自分へ", "#eee4c5", "☆"]
    };

    // STORAGE
    function loadMessages() {
        let messages = JSON.parse(localStorage.getItem("messages")) || [];

        if (messages.length) {
            messages.forEach(m => localStorage.setItem("message_" + m.id, JSON.stringify(m)));
            localStorage.removeItem("messages");
        }

        return Object.keys(localStorage)
            .filter(key => key.startsWith("message_"))
            .map(key => JSON.parse(localStorage.getItem(key)))
            .filter(Boolean)
            .sort((a, b) => b.id - a.id);
    }

    function saveMessage(message) {
        localStorage.setItem("message_" + message.id, JSON.stringify(message));
    }

    // PAGE CONTROL
    function showPage(page) {
        $("#home, #archivePage, #reader").hide();
        $(page).show();
    }

    // ARCHIVE
    function displayArchive() {
        const messages = loadMessages();
        $("#list").empty();
        $("#empty").toggle(!messages.length);
        $("#archiveCount").text(messages.length + " 件");

        messages.forEach(m => {
            const c = categories[m.genre] || [];
            $("#list").append(
                $("<div>", { class: "card", "data-id": m.id })
                    .css("background", c[1] || "#edf1e5")
                    .append(
                        $("<div>", { class: "card-icon" }).text(c[2] || "✉"),
                        $("<div>", { class: "card-content" }).append(
                            $("<h3>").text(m.subject || "件名なし"),
                            $("<p>", { class: "card-to" }).text("宛先：" + (m.to || "なし"))
                        ),
                        $("<div>", { class: "card-date" }).text(m.date)
                    )
            );
        });

        showPage("#archivePage");
    }

    // SAVE MESSAGE
    $("#save").on("click", function() {
        const text = $("#memo").val().trim();

        if (!text) return alert("本文を入力してください。");

        saveMessage({
            id: Date.now(),
            to: $("#to").val().trim(),
            subject: $("#subject").val().trim(),
            genre: $("#genre").val(),
            text,
            date: new Date().toLocaleDateString("ja-JP")
        });

        $("#to, #subject, #memo").val("");
        alert("メールを保存しました！");
        $("#archiveCount").text(loadMessages().length + " 件");
    });

    // OPEN MESSAGE
    $(document).on("click", ".card", function() {
        const id = $(this).attr("data-id");
        const m = loadMessages().find(m => m.id == id);
        if (!m) return;

        const c = categories[m.genre] || [];

        $("#letter").empty().css("background", c[1] || "#edf1e5").append(
            $("<p>", { class: "letter-label" }).text("MAIL MEMO帳 / " + (c[0] || "その他")),
            $("<h2>", { class: "letter-subject" }).text(m.subject || "件名なし"),
            $("<p>", { class: "letter-meta" }).text("宛先： " + (m.to || "なし")),
            $("<p>", { class: "letter-meta" }).text("日付： " + m.date),
            $("<hr>", { class: "letter-divider" }),
            $("<p>", { class: "letter-text" }).text(m.text)
        );

        $("#deleteMessage").attr("data-id", id);
        showPage("#reader");
    });

    // DELETE MESSAGE
    $("#deleteMessage").on("click", function() {
        const id = $(this).attr("data-id");

        if (!confirm("このメールを削除しますか？")) return;
        if (!confirm("削除したメールは元に戻せません。")) return;
        if (!confirm("最後の確認です。本当に削除しますか？")) return;

        localStorage.removeItem("message_" + id);
        displayArchive();
    });

    // NAVIGATION
    $("#save").on("click", function() {});
    $("#navNew").on("click", function(e) {
        e.preventDefault();
        showPage("#home");
        $("#to").focus();
    });

    $("#navArchive").on("click", function(e) {
        e.preventDefault();
        displayArchive();
    });

    $("#homeButton").on("click", () => showPage("#home"));
    $("#backToArchive").on("click", displayArchive);

    // START
    showPage("#home");
    $("#archiveCount").text(loadMessages().length + " 件");

});
