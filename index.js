const log = console.log.bind(console)

const sel = (selector) => document.querySelector(selector)

const selAll = (selector) => document.querySelectorAll(selector)

const templateCell = function(line, x) {
    let container = ''
    for (let i = 0; i < line.length; i++) {
        let member = line[i]
        let cell = `
            <div class="cell" data-number="${ member }" data-x="${ x }" data-y="${ i }">${ member }</div>`
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

    let eleRoot = sel('.mine-root')
    eleRoot.insertAdjacentHTML( 'beforeend', container)
}

const bindEventDelegate = function(square) {
    let allCell = sel('#id-div-mime')
    allCell.addEventListener('click', (e) => {
        let self = e.target
        let isTarget = self.classList.contains('cell')
        if (isTarget) {
            log('Im here')
            vjkl(self, square)
        }

    })
}

const vjkl = function(cell, square) {
    let { number, x, y } = cell.dataset
    log('x', x, 'y', y)
    let classList = cell.classList
    let hasOpen = classList.contains('opened')
    if (hasOpen) {
        return
    }

    if (number === '9') {
        // 游戏结束
        let container = sel('#id-div-mime')
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


const vjklAround = function(square, x, y) {
    // 左边三个
    vjkl1(square, x - 1, y - 1)
    vjkl1(square, x - 1, y)
    vjkl1(square, x - 1, y + 1)

    // 上下两个
    vjkl1(square, x , y - 1)
    vjkl1(square, x , y + 1)

    // 右边三个
    vjkl1(square, x + 1, y - 1)
    vjkl1(square, x + 1, y)
    vjkl1(square, x + 1, y + 1)
}

const vjkl1 = function(square, x, y) {
    if (x < 0 || y < 0 || x > square[0].length || y > square.length) {
        return
    }

    let allCell = selAll('.cell')
    allCell.forEach((item) => {
        let attr = item.attributes
        let isTarget = attr['data-x'].value === String(x) &&
            attr['data-y'].value === String(y)
        if (isTarget) {
            let { number, x, y } = item.dataset
            if (number === '9') {
                // 什么也不做
            } else if (number === '0') {
                item.classList.add('opened')
                vjklAround(square, x, y)
            } else {
                item.classList.add('opened')
            }
        }
    })

}

const test = () => {
    let lineTest = [1, 2, 3, 5, 9]
    let lineEle = templateCell(lineTest, 8)
}

const __main = () => {
    let s = ' [[9,1,0,0,0,1,1,1,0],[1,1,0,0,1,2,9,1,0],[1,1,1,0,1,9,2,1,0],[1,9,2,1,1,1,1,0,0],[1,2,9,1,0,0,1,1,1],[1,2,1,1,0,1,2,9,1],[9,1,0,0,1,2,9,2,1],[1,2,1,1,1,9,2,1,0],[0,1,9,1,1,1,1,0,0]]'
    let square = JSON.parse(s)
    log('square', square)
    renderSquare(square)
    bindEventDelegate(square)
    // test()
}

__main()