var human = (function () {
    'use strict';

    var human = {};

    function simpleTime(t) {
        var d = new Date(t * 1000);
        return {
            year: d.getFullYear(),
            month: d.getMonth() + 1,
            date: d.getDate(),
            day: d.getDay() || 7, // 周日作为最后一天
            hour: d.getHours(),
            minute: d.getMinutes()
        };
    }

    human.time = function (t) {
        t = parseInt(t, 10);
        var d = simpleTime(t);
        var n = simpleTime(new Date() / 1000);
        var y = simpleTime(new Date() / 1000 - 86400); // 昨天

        // 今天
        if (d.year == n.year && d.month == n.month && d.date == n.date) { 
            return s.sprintf('今天 %02d:%02d', d.hour, d.minute);
        }

        // 昨天
        if (d.year == y.year && d.month == y.month && d.date == y.date) {
            return s.sprintf('昨天 %02d:%02d', d.hour, d.minute);
        }

        // 本周早些时候
        if (t + 86400 * 7 > new Date() / 1000 && d.day < n.day) {
            return s.sprintf('周%s %02d:%02d', ['', '一', '二', '三', '四', '五'][d.day], d.hour, d.minute);
        }

        // 今年
        if (d.year == n.year) {
            return s.sprintf('%d月%d日 %02d:%02d', d.month, d.date, d.hour, d.minute);
        }

        // 更早
        return s.sprintf('%d年%d月%d日', d.year, d.month, d.date);
    };

    human.money = function (money) {
        return s.sprintf('¥%.02f', parseFloat(money));
    }

    return human;
})();
