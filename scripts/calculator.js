(function () {

    const RESULT_PADDING_RIGHT = 0.07
    const RESULT_CONTENT_MAX_WIDTH_PERCENTAGE = 1 - RESULT_PADDING_RIGHT * 2;

    let $result = document.querySelector('.result');
    let $expr = document.querySelector('.expr');
    let $dot = document.querySelector('.keybtn.dot');
    let $equal = document.querySelector('.keybtn.operator.equal');
    let $clear = document.querySelector('.keybtn.cal.clear');
    let $negative = document.querySelector('.keybtn.cal.negative');
    let $percent = document.querySelector('.keybtn.cal.percent');
    let $numbers = document.querySelectorAll('.keybtn.number');
    let $operators = document.querySelectorAll('.keybtn.operator');

    let expr = '0';
    let operators = ['+', '-', '*', '/'];

    set(expr);

    function set(value) {
        if (typeof value === 'number') {
            value = parseFloat(value.toPrecision(8));
        }
        expr = value;
        $expr.innerText = expr;
        resize();
    }

    function isExprEndsWithOperator() {
        return operators.indexOf(expr[expr.length - 1]) > -1;
    }

    function resize() {
        let maxWidth = $result.clientWidth * RESULT_CONTENT_MAX_WIDTH_PERCENTAGE;
        if ($expr.scrollWidth > maxWidth) {
            $expr.style.transform = `scale(${ maxWidth / $expr.scrollWidth})`;
            $expr.style.transformOrigin = 'right center';
        } else {
            $expr.style.transform = `scale(1)`;
        }
    }

    for (let i = 0; i < $numbers.length; i++) {
        $numbers[i].addEventListener('click', function (event) {
            let num = event.target.dataset.number;
            set(expr === '0' ? num : (expr + num));
        });
    }

    for (let i = 0; i < $operators.length; i++) {
        $operators[i].addEventListener('click', function (event) {
            let oper = event.target.dataset.operator;
            if (operators.indexOf(oper) > -1) {
                if (isExprEndsWithOperator()) {
                    set(expr.slice(0, expr.length - 1) + oper);
                } else {
                    set(expr + oper);
                }
            }
        })
    }

    $equal.addEventListener('click', function (event) {
        set(eval(expr));
    });

    $dot.addEventListener('click', function (event) {
        if (isNaN(expr[expr.length - 1])) return;
        if (expr.indexOf('.') === -1) return set(expr + '.');

        let rest = expr.slice(expr.lastIndexOf('.') + 1); 
        if (operators.map(function(operator) { return rest.indexOf(operator) > -1; })
            .every(function(result) { return result === false; })
        ) return;

        set(expr + '.');
    });

    $clear.addEventListener('click', function() {
        set('0');
    });

    $negative.addEventListener('click', function(event) {
        if (!isNaN(expr)) {
            set(-eval(expr));
        }
    });

    $percent.addEventListener('click', function(event) {
        if (!isNaN(expr)) {
            set(eval(expr) / 100);
        }
    });

})()