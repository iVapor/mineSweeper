const log = console.log.bind(console)

const eleSelector = (selector) => document.querySelector(selector)

const eleSelectorAll = (selector) => document.querySelectorAll(selector)

const bindEleEvent = function(element, eventName, callback) {
    element.addEventListener(eventName, callback)
}

const templateCell = function(line, x) {
    let container = ''
    for (let i = 0; i < line.length; i++) {
        let member = line[i]
        let ele = member

        if (member === 9) {
            let apple = '<img class="apple" src="./img/red_apple.png" alt="apple"/>'
            ele = apple
        }

        ele = `
            <img class="flag" src="./img/flag.png" alt="flag"/>
            <span>${ member }</span>
        `
        let cell = `
            <div class="cell" data-number="${ member }" data-x="${ x }" data-y="${ i }">
                
                ${ ele }</div>`
        container += cell
    }

    let rowEle = `
    <div class="row">${ container }</div>`
    return rowEle
}

const templateRow = function(square) {
    let container = ''
    for (let i = 0; i < square.length; i++) {
        let member = square[i]
        let row = templateCell(member, i)
        container += row
    }

    return container
}

const renderSquare = function(square) {
    let allRow = templateRow(square)
    let container = `
        <div id="id-div-mime">${ allRow }</div>`

    let eleRoot = eleSelector('.mine-root')
    eleRoot.insertAdjacentHTML( 'beforeend', container)
}

const changeTime = (timeMark) => {
    let secondEle = eleSelector('.show-second')
    let current = secondEle.innerHTML
    let updateSecond = Number(current) + 1



    let minEle = eleSelector('.show-min')
    let currentMin = minEle.innerHTML

    if (updateSecond === 2) {
        let updateMin = Number(currentMin) + 1
        if (updateMin === 30) {
            clearInterval(timeMark)
        }
        if (String(updateMin).length === 1) {
            updateMin = `0${ updateMin }`
        }

        minEle.innerHTML = updateMin
        updateSecond = '00'
    }

    if (String(updateSecond).length === 1) {
        updateSecond = `0${ updateSecond }`
    }
    secondEle.innerHTML = updateSecond

}

const startTime = () => {
    let timeMark =  setInterval(function () {
        changeTime(timeMark)
    }, 1000)
}

const toggleFlag = (self) => {
    let flagEle = self.querySelector('.flag')
    let countEle = eleSelector('.mine-count')
    let limit = Number(countEle.dataset.limit)

    if (limit !== 0) {
        flagEle.classList.toggle('show-flag')
    }
}

/**
 * 放置旗帜
 */
const setFlag = () => {
    let allCell = eleSelector('#id-div-mime')
    allCell.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        let self = e.target
        let isTarget = self.classList.contains('cell')
        let isFlag = self.classList.contains('flag')

        if (isTarget) {
            toggleFlag(self)
            countFlag()
        } else if (isFlag) {
            // 取消放置
            self.classList.toggle('show-flag')
            countFlag()
        }

    })
}

/**
 * 统计雷
 */
const countFlag = () => {
    let allFlag = eleSelectorAll('.show-flag')
    let countEle = eleSelector('.mine-count')
    let total = Number(countEle.dataset.count)
    let currentFlag = allFlag.length
    log('total', total)

    let restMine = total - currentFlag
    countEle.innerHTML = restMine
    countEle.dataset.limit = restMine
}

const bindEventDelegate = function(square) {
    let allCell = eleSelector('#id-div-mime')
    allCell.addEventListener('click', (e) => {
        let self = e.target
        let isTarget = self.classList.contains('cell')
        if (isTarget) {
            vjkl(self, square)
        }

        startTime()
    })

    setFlag()
}

/**
 * 统计生成的地雷
 */
const countCreateMine = (square) => {
    let count = 0
    for (let i = 0; i < square.length; i++) {
        let row = square[i]

        for (let j = 0; j < row.length; j++) {
            let cell = row[j]
            if (cell === 9) {
                count++
            }
        }
    }

    let countEle = `<span class="mine-count" data-count="${ count }"
            data-limit="${ count }"
            >${ count }</span>`
    let container = eleSelector('.num-container')
    container.insertAdjacentHTML('beforeend', countEle)
}

const vjkl = function(cell, square) {
    let { number, x, y } = cell.dataset
    let classList = cell.classList
    let hasOpen = classList.contains('opened')
    if (hasOpen) {
        return
    }

    if (number === '9') {
        // 游戏结束
        let container = eleSelector('#id-div-mime')
        container.classList.add('game-end')
        cell.classList.add('opened')
        cell.classList.add('red-cell')
    } else if (number === '0') {
        cell.classList.add('opened')
        vjklAround(square, Number(x), Number(y))
    } else {
        cell.classList.add('opened')
    }

}

/**
 *
 * @param square
 * @param x 行
 * @param y 列
 */
const vjklAround = function(square, x, y) {
    // 左边三个
    vjkl1(square, x - 1, y - 1)
    vjkl1(square, x, y - 1)
    vjkl1(square, x + 1, y - 1)

    // 上下两个
    vjkl1(square, x - 1 , y)
    vjkl1(square, x + 1, y)

    // 右边三个
    vjkl1(square, x - 1, y + 1)
    vjkl1(square, x, y + 1)
    vjkl1(square, x + 1, y + 1)
}

const vjkl1 = function(square, x, y) {
    if (x >= 0 && y >= 0 && x < square[0].length && y < square.length) {
        let selName = `[data-x="${ x }"][data-y="${ y }"]`
        let cell = eleSelector(selName)

        let classList = cell.classList
        let hasOpen = classList.contains('opened')
        if (hasOpen) {
            return
        }

        let { number } = cell.dataset
        if (number === '9') {
            // 什么也不做
        } else if (number === '0') {
            cell.classList.add('opened')
            vjklAround(square, x, y)
        } else {
            cell.classList.add('opened')
        }
    }
}

const test = () => {
    // let lineTest = [1, 2, 3, 5, 9]
    // let lineEle = templateCell(lineTest, 8)
    testMineData()
}

const game = () => {
    let square = createMineData()
    log('square', square)
    countCreateMine(square)
    renderSquare(square)
    bindEventDelegate(square)
}

const clearGame = () => {
    let eleRoot = eleSelector('.mine-root')
    eleRoot.innerHTML = ''
}

const newGame = () => {
    let btn = eleSelector('.new-game')
    bindEleEvent(btn, 'click', function (e) {
        clearGame()
        game()

    })
}

const __main = () => {
    game()
    newGame()
}

__main()
