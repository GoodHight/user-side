/**
 * Created by flypie on 16/7/20.
 */
var dateParser = {
    dashToNone: function (dashDate) {
        var dateArray = dashDate.match(/[0-9]+/g);
        var year = dateArray[0];
        var month = dateArray[1];
        var date = dateArray[2];
        if (month < 10) {
            month = '0' + month;
        }
        if (date < 10) {
            date = '0' + date;
        }
        return year + month + date;
    },
    dashToChinese: function (dashDate) {
        var dateArray = dashDate.match(/[0-9]+/g);
        var year = dateArray[0];
        var month = dateArray[1];
        var date = dateArray[2];
        return year + '年' + month + '月' + date + '日';
    },
    dashToChineseOnlyMonthAndDate: function (dashDate) {
        var dateArray = dashDate.match(/[0-9]+/g);
        var month = dateArray[1];
        var date = dateArray[2];
        return month + '月' + date + '日';
    },
    datePlus: function (dashDate, plusNumber) {
        var dateArray = dashDate.match(/[0-9]+/g);
        var year = dateArray[0];
        var month = dateArray[1];
        var date = dateArray[2];
        var dateNum = parseInt(date);
        var monthNum = parseInt(month);
        var yearNum = parseInt(year);


        if (plusNumber < 0) {
            if (dateNum + plusNumber <= 0) {
                var divider = dateParser.getMonthDateNumber(dashDate);
                var monthPlusNumber = parseInt((dateNum + plusNumber) / divider) - 1;

                if ((monthNum + monthPlusNumber) <= 0) {
                    monthNum = 12 + (monthNum + monthPlusNumber) % 12;
                    yearNum = yearNum + parseInt((monthNum + monthPlusNumber) / 12) - 1;
                } else {
                    monthNum += monthPlusNumber;
                }

                dateNum = dateParser.getMonthDateNumber(yearNum + '-' + monthNum + '-' + dateNum) + (dateNum + plusNumber) % divider;
            } else {
                dateNum += plusNumber;
            }
        } else {
            var divider = dateParser.getMonthDateNumber(dashDate);

            if ((dateNum + plusNumber) > divider) {
                var monthPlusNumber = parseInt((dateNum + plusNumber) / divider);
                dateNum = (dateNum + plusNumber) % divider;

                if ((monthNum + monthPlusNumber) > 12) {
                    monthNum += parseInt((monthNum + monthPlusNumber) / 12);
                    yearNum = (monthNum + monthPlusNumber) % 12;
                } else {
                    monthNum += monthPlusNumber;
                }
            } else {
                dateNum += plusNumber;
            }
        }

        return yearNum + '-' + monthNum + '-' + dateNum;
    },
    monthPlus: function (dashDate, plusNumber) {
        var dateArray = dashDate.match(/[0-9]+/g);
        var year = dateArray[0];
        var month = dateArray[1];
        var date = dateArray[2];
        var monthNum = parseInt(month);
        var yearNum = parseInt(year);

        if (plusNumber < 0) {
            if ((monthNum + plusNumber) <= 0) {
                monthNum = 12 + (monthNum + plusNumber) % 12;
                yearNum = yearNum + parseInt((monthNum + plusNumber) / 12) - 1;
            } else {
                monthNum += plusNumber;
            }
        } else {
            if ((monthNum + plusNumber) > 12) {
                monthNum = (monthNum + plusNumber) % 12;
                yearNum = yearNum + parseInt((monthNum + plusNumber) / 12);
            } else {
                monthNum += plusNumber;
            }
        }

        return yearNum + '-' + monthNum + '-' + date;
    },
    yearPlus: function (dashDate, plusNumber) {
        var dateArray = dashDate.match(/[0-9]+/g);
        var year = dateArray[0];
        var month = dateArray[1];
        var date = dateArray[2];
        var yearNum = parseInt(year);
        yearNum += plusNumber;
        return yearNum + '-' + month + '-' + date;
    },
    dashToCustom: function (dashDate, customDivider) {
        var dateArray = dashDate.match(/[0-9]+/g);
        var year = dateArray[0];
        var month = dateArray[1];
        var date = dateArray[2];
        return year + customDivider + month + customDivider + date;
    },
    getMonthDateNumber: function (dashDate) {
        var dateNumber = 0;

        var dateArray = dashDate.match(/[0-9]+/g);
        var month = dateArray[1];
        var monthNum = parseInt(month);

        if (dateParser.isBigMonth(dashDate)) {
            dateNumber = 31;
        } else {
            if (monthNum == 2) {
                if (dateParser.isLeapYear(dashDate)) {
                    dateNumber = 29;
                } else {
                    dateNumber = 28;
                }
            } else {
                dateNumber = 30;
            }
        }
        return dateNumber;
    },
    isLeapYear: function (dashDate) {
        var dateArray = dashDate.match(/[0-9]+/g);
        var yearNum = parseInt(dateArray[0]);
        if ((yearNum % 4 == 0 && yearNum % 100 != 0) || (yearNum % 400 == 0)) {
            return true;
        } else {
            return false;
        }
    },
    isBigMonth: function (dashDate) {
        var dateArray = dashDate.match(/[0-9]+/g);
        var month = dateArray[1];
        if (/^([13578]|10|12)$/.test(month)) {
            return true;
        } else {
            return false;
        }
    }
};