let contentJSON = 
`[
	{
		"name": "Three Days Grace",
		"photo":"контент/three-days-grace.1_f.jpg",
		"subs":3500,
		"description":"Three Days Grace — канадская рок-группа, исполняющая альтернативный метал и постгранж. Была сформирована под названием Groundswell в Норвуде, Онтарио, Канада в 1992 году."
	},
	{
		"name":"Thousand Foot Krutch",
		"photo":"контент/31.jpg",
		"subs":6900,
		"description":"Thousand Foot Krutch (сокращенно TFK) — канадская рок-группа. По словам фронтмена группы Тревора МакНивена, название означает тот момент в нашей жизни, когда мы понимаем, что нельзя полагаться только на свои силы."
	},
	{
		"name":"Pyrokinesis",
		"photo":"контент/m1000x1000.jpg",
		"subs":3500,
		"description":"Pyrokinesis – он же Андрей Пирокинезис. Его музыка - это не просто выдуманный образ, а реально прожитые и прочувствованные автором моменты. Он умеет создать атмосферу, которая сразу возникает при прослушивании треков."
	},
	{
		"name":"ГРОБ",
		"photo":"контент/GuVUT8XBArw_d_850.jpg",
		"subs":10000,
		"description":"«Гражданская оборона» — советская и российская рок-группа, основанная 8 ноября 1984 года в Омске Егором Летовым и Константином Рябиновым, наиболее заметная представительница сибирского панк-рока."
	},
	{
		"name":"Horus",
		"photo":"контент/unnamed.jpg",
		"subs": 1300,
		"description":"Денис Луперкаль — один из участников группы Проект Увечье. (прим. Нередко вместе с названием группы приписывают числа 16 13, которые обозначают 16 и 13 буквы латинского алфавита p и m — Project mayhem."
	}
]`;

const slider = document.getElementById('slider');
const sliderLine = document.getElementById('slider_line');

//Класс для создания контента в блоке слайдера
class Content{
	constructor(name, photo, subs, info) {
		this.name = name;
		this.photo = photo;
		this.subs = subs;
		this.info  = info;
	}
}

//Класс для перевода контента в различные форматы
class ContentConverter {
	constructor(content) {
		this.content = content;
	}

	intoJSON() {
		return JSON.stringify(this.content, null, 2);
	}
}




//Блок действия программы

addBlocksIntoSliderLine(contentJSON);
addClassesToSliderItems();
addEventsOfDeformationOnAllBlocks();

//Конец блока действия программы


//Заполнение линии слайдера контентом из массива
function addBlocksIntoSliderLine(jsonContent) {
	const arrayOfContent = JSON.parse(jsonContent);

	//Формируем размеры линии слайдера относительно фрейма слайдера
	sliderLine.style.width = `${arrayOfContent.length * slider.clientWidth}px`;
	sliderLine.style.height = `${slider.clientHeight}px`;

	for(let i = 0; i < arrayOfContent.length; i++) {
		sliderLine.append(createOneBlock(arrayOfContent[i]));
	}
};

function createOneBlock(content) {
	const block = document.createElement('div');
	block.className = 'slider_item';
	block.innerHTML = 
	`
		<div class="block">
			<div class="wrapper">
				<div class="name">
					${content.name}
				</div>
				<img data-src = ${content.photo} alt = "">
				<div class="subs">
					Подписчиков: <span>${content.subs}</span>
				</div>
				<div class="description">
					Описание: <span>${content.description}</span>
				</div>
			</div>
		</div>
	`;
	giveShapeOfSliderFrameToBlock(block);
	lazyLoad(block.querySelector('img'));
	return block;
}

//Функция постепенной прогрузки изображений
function lazyLoad(img) {
	img.setAttribute('src', img.getAttribute('data-src'));
	img.onload = function() {
		img.removeAttribute('data-src');
	}
}

function giveShapeOfSliderFrameToBlock(block) {
	block.style.width = `${slider.clientWidth}px`;
	block.style.height = `${slider.clientHeight}px`;
}

//Функция расстановки классов при загрузке страницы
function addClassesToSliderItems() {
	const arrayOfSliderItems = document.getElementsByClassName('slider_item');

	if(arrayOfSliderItems.length > 0) {
		arrayOfSliderItems[0].classList.add('active');
		arrayOfSliderItems[0].classList.add('first');
		arrayOfSliderItems[arrayOfSliderItems.length - 1].classList.add('last');		
	}

}

//Получения активного элемента (индексом и объектом)
function getIndexOfActualItem() {
	const arrayOfSliderItems = document.getElementsByClassName('slider_item');

	for(let i = 0; i < arrayOfSliderItems.length; i++) {
		if(arrayOfSliderItems[i].classList.contains('active'))
			return i;
	}
	return -1;
}
function getActualItem() {
	return document.getElementsByClassName('slider_item')[getIndexOfActualItem()];
}

//Изменения положения активного элемента при пролистывании
function moveRightChangeClasses() {
	const arrayOfSliderItems = document.getElementsByClassName('slider_item');

	let indexOfActual =  getIndexOfActualItem();
	if(!arrayOfSliderItems[indexOfActual].classList.contains('last')) {
		arrayOfSliderItems[indexOfActual].classList.remove('active');
		arrayOfSliderItems[indexOfActual + 1].classList.add('active');
	}
}
function moveLeftChangeClasses() {
	const arrayOfSliderItems = document.getElementsByClassName('slider_item');

	let indexOfActual =  getIndexOfActualItem();
	if(!arrayOfSliderItems[indexOfActual].classList.contains('first')) {
		arrayOfSliderItems[indexOfActual].classList.remove('active');
		arrayOfSliderItems[indexOfActual - 1].classList.add('active');
	}
}





//Добавление события пролистывания слайдера
slider.addEventListener(
    'mousedown',  
    (event) => {

    	//Убираем плавнсть для немедленного отклика на действие
    	sliderLine.style.transition = 'none';
    	const targetItemBlock = event.target.closest('.slider_item');
    	const startPosOfSliderLine = sliderLine.style.left === 0 ? 0 : +sliderLine.style.left.slice(0, this.length - 2);
    	//Координаты по Х при клике и при дальнейших движениях мыши
    	const firstClickX = event.pageX;
    	let moveX = event.pageX;

    	event.preventDefault();

    	if(event.target.closest('.slider_item'))
    		slider.addEventListener('mousemove', moveSlider)
    	slider.onmouseup = slide;

    	//Если курсор ушел со слайдера, то считается, что пользователь отпустил мышь и совершаем аналогичное действие
    	document.onmouseout = function(event) {
    		if(event.target.closest('.slider') && (!event.relatedTarget || !event.relatedTarget.closest('.slider'))) {
    			slide();
    		}
    	}

    	function slide() {

    		//Вне зависимости от резуальтата слайда необходимо плавное завершение действия
    		sliderLine.style.transition = '0.5s ease';

    		//Порог перелистывания составляет процент от ширины блока слайдера
    		const threshold = Math.round(slider.clientWidth * 0.4);

    		//Если смещение по Х составило больше порога, то пролистываем, иначе возвращаем в исходное положение
    		if(firstClickX - moveX >= threshold && !getActualItem().classList.contains('last')){
    			sliderLine.style.left = `${startPosOfSliderLine - slider.clientWidth}px`;
    			moveRightChangeClasses();
    		}
    		else if(firstClickX - moveX <= -threshold && !getActualItem().classList.contains('first')){
    			sliderLine.style.left = `${startPosOfSliderLine + slider.clientWidth}px`;
    			moveLeftChangeClasses();
    		}
    		else 
    			sliderLine.style.left = `${startPosOfSliderLine}px`;

    		//Чистка слушателей при отпускании мыши
	    	slider.removeEventListener('mousemove', moveSlider);
	    	slider.onmouseup = null;
	    	document.onmouseout = null;
    	}

    	function moveSlider(event) {
    		moveX = event.pageX;
    		if(!(targetItemBlock.classList.contains('first') && firstClickX - moveX < 0) && 
    		   !(targetItemBlock.classList.contains('last') && firstClickX - moveX > 0))
    			
    			sliderLine.style.left = `${startPosOfSliderLine - (firstClickX - moveX)}px`;
    	}

    }
)


//Функция развешивания событий деформации на элементы слайдера
function addEventsOfDeformationOnAllBlocks() {
	const arrayOfSliderItems = document.getElementsByClassName('slider_item');

	for(let item of arrayOfSliderItems) {
		item.addEventListener('mousedown', shearDeformation);
	}
}
//Функция деформации элемента слайдера
function shearDeformation(event){

	//Считаем клик дочерних блоков за клик по внешнему блоку
	const target = event.target.closest('.active');
	const startXClick = event.pageX;

	//Для четкого управления убираем задержку, установленную для плавного возврата
	//блока в начальное положение при отпускании мыши
	target.style.transition = 'none';
	event.preventDefault();

	//Важно движение как внутри блока при зажатой мыши так и вне него
	document.addEventListener(
		'mousemove',
		scaleElement
	);

	document.onmouseup = function() {
		document.removeEventListener('mousemove', scaleElement);

		//Плавный возврат блока в изначальное положение
		target.style.transition = '0.5s';
		target.style.transform = 'none';

		document.onmouseup = null;
	}
	
	function scaleElement(event) {
		const actualCoordX = event.pageX;

		const scale = 1 - Math.abs(actualCoordX - startXClick) * 0.007 <= 0.91
		? 0.91
		: 1 - Math.abs(actualCoordX - startXClick) * 0.007;
		target.style.transform = `scale(${scale}, 1)`;
	}
}