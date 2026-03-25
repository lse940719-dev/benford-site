let chart;

function leadingDigit(n) {
    return parseInt(n.toString().replace(/^0+/, '')[0]);
}

function benford(data) {
    let count = Array(10).fill(0);

    data.forEach(n => {
        if (n > 0) {
            count[leadingDigit(n)]++;
        }
    });

    let total = count.reduce((a, b) => a + b, 0);

    return count.slice(1).map(c => c / total);
}

function theoretical() {
    let arr = [];
    for (let d = 1; d <= 9; d++) {
        arr.push(Math.log10(1 + 1 / d));
    }
    return arr;
}

// ⭐ 卡方檢定
function chiSquare(actual, expected, total) {
    let chi = 0;
    for (let i = 0; i < 9; i++) {
        let o = actual[i] * total;
        let e = expected[i] * total;
        chi += (o - e) ** 2 / e;
    }
    return chi;
}

// ⭐ CSV 讀取
document.getElementById("file").addEventListener("change", function (e) {
    let file = e.target.files[0];
    let reader = new FileReader();

    reader.onload = function (e) {
        document.getElementById("input").value = e.target.result;
    };

    reader.readAsText(file);
});

function analyze() {
    let input = document.getElementById("input").value;
    let data = input.split(/[\s,]+/).map(Number);

    let actual = benford(data);
    let expected = theoretical();

    let total = data.length;
    let chi = chiSquare(actual, expected, total);

    let resultText = "Digit | Actual | Expected\n";

    for (let i = 0; i < 9; i++) {
        resultText += `${i + 1} | ${actual[i].toFixed(3)} | ${expected[i].toFixed(3)}\n`;
    }

    resultText += `\n卡方值: ${chi.toFixed(3)}\n`;

    // ⭐ 判斷是否符合
    if (chi < 15.51) {
        resultText += "✅ 符合班佛定律";
    } else {
        resultText += "❌ 可能異常（疑似造假）";
    }

    document.getElementById("output").innerText = resultText;

    drawChart(actual, expected);
}

// ⭐ 畫圖
function drawChart(actual, expected) {
    let ctx = document.getElementById("chart");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
            datasets: [
                {
                    label: '實際',
                    data: actual
                },
                {
                    label: '理論',
                    data: expected
                }
            ]
        }
    });
}

// ⭐ antigravity 彩蛋
function antigravity() {
    window.open("https://xkcd.com/353/");
}