window.onload = function () {
    document.getElementById("btnGet").onclick = builder;
}

// Создадим "компонент", функцию "builder", для генерации игрового поля. Он булет выполнять следующие задачи:
// - очищать игровое поле
// - получать от скрипта "https://kde.link/test/get_field_size.php" размеры игрового поля в формате JSON, пример: {"width":"5", "height":"8"}
// - создавать массив элементов игрового поля, перемешивать его в случайном порядке
// - создавать элементы игрового поля и вкладывать их в элемент с id="gameField"

// после генерации игрового поля вызываем "компонент" игры - функция "game"

function builder() {

    // получаем контейнер игрового поля с id="gameField" и удаляем его дочерние элементы
    var div = document.getElementById("gameField");
    div.innerHTML = ""

    // получаем от скрипта размеры игрового поля
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://kde.link/test/get_field_size.php", false);
    xhr.send();

    // записывам в переменную ответ скипта
    var game_field_size = JSON.parse(xhr.responseText);

    // создаем массив элементов игрового поля
    var game_field_elements = [];
    // расчитываем необходимое кол-во элементов массива по формуле width*height
    var game_field_elements_count = game_field_size.width*game_field_size.height;

    // создаем массив изображений
    var images = [
        "https://kde.link/test/2.png",
        "https://kde.link/test/8.png",
        "https://kde.link/test/4.png",
        "https://kde.link/test/5.png",
        "https://kde.link/test/7.png",
        "https://kde.link/test/0.png",
        "https://kde.link/test/3.png",
        "https://kde.link/test/6.png",
        "https://kde.link/test/1.png",
        "https://kde.link/test/9.png"
    ]

    // заполняем массив изображениями по 2 шт., для получения индекса изображения используем деление по остатку
    for (let i = 0, j = 0; i < game_field_elements_count; i+=2, j++) {
        game_field_elements[i] = images[ j % images.length ];
        game_field_elements[i+1] = images[ j % images.length ];
    }

    // перемешиваем массив элементов игрового поля в случайном порядке
    function randomSort(a, b) {
        return Math.random() - 0.5;
    }          
    game_field_elements.sort(randomSort);

    // создаем элементы разметки и вкладываем их в элемент с id="game"        
    for (let i = 0; i < game_field_elements.length; i++) {
        let elem = document.createElement("div");
        let img = document.createElement("img");
        img.setAttribute("src", game_field_elements[i]);
        elem.appendChild(img);
        div.appendChild(elem);
    }
    div.style.gridTemplateColumns = "repeat("+game_field_size.width+", 1fr)";   

    // вызываем "компонент" игры - функцию "game"
    game();
}

// Создадим "компонент", функцию ""game", для управления игрой. Он булет выполнять следующие задачи:
// - устанавливать изображениям игрового поля обработчик события "click"
// - выполнять проверку пар изображений, если изображения совпадают - удалять им обработчик события "click"

function game() {

    // получаем контейнер игрового поля с id="gameField"
    var div = document.getElementById("gameField");    

    // устанавливаем дочерним элементам контейнера игрового поля обработчик события "click"
    for (i = 0; i < div.children.length; i++) {
        div.children[i].children[0].addEventListener("click", clickHandler);
    }

    // обработчик события "click" устанавливает элементу "opacity = 1.0", 
    // добавляет элемент в массив "arr" для сравнения, 
    // когда кол-во элементов в массиве "arr" == 2 вызывает функцию сравнения изображений "compareImages"
    var arr = [];
    function clickHandler(e) {
        e.target.style.opacity = 1.0;
        arr.push(e.target);

        if (arr.length == 2) {
            compareImages();
            arr.length = 0;
        }
    }

    // функция сравнения изображений сравнивает свойства "src" элементов массива "arr"
    // если они разные - скрывает элементы с задержкой 500мс
    // если одинаковые - удаляет элементам обработчик события "click"
    // переменная "goal" - число, кол-во элементов игрового поля, которое необходимо "открыть" игроку
    // игра окончена, когда "goal == 0"
    var goal = div.children.length;
    function compareImages () {        
        if (arr[0].src != arr[1].src) {
            setTimeout(function(elem) { elem.style.opacity = 0.0 }, 500, arr[0]);
            setTimeout(function(elem) { elem.style.opacity = 0.0 }, 500, arr[1]);
        } else {
            arr[0].removeEventListener("click", clickHandler);
            arr[1].removeEventListener("click", clickHandler);
            goal -= 2;
            if (goal == 0) { alert("Game over");}
        }
    }
}