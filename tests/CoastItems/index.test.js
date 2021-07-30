const puppeteer = require("puppeteer");


describe("Тест фильтра по стоимости", () => {
    let browser=null;
    let page=null;
    let min = "50";
    let max = "200";
    afterAll(async()=>{
        
     await browser.close();
    });
    test("Запуск браузера", async ()=>{
         browser = await puppeteer.launch({ 
             headless: false,
             args: ['--start-fullscreen']})
    });
    test("Открытие страницы", async ()=>{
         page = await browser.newPage();
         await page.setViewport({
            width: 1920,
            height: 1080});
    });
    test("Переход на страницу сайта", async ()=>{
        await page.goto("https://www.ecwid.ru/demo/search", {waitUntil:"domcontentloaded"}); 
    });
   test("Ввод минимальной цены в поисковую строку", async ()=>{
        await page.waitForSelector(".ec-filter__price-from .form-control__text");
        await page.type(".ec-filter__price-from .form-control__text", min, { delay: 100 }); 
    },15000);
    test("Ввод максимальной цены в поисковую строку", async ()=>{
        await page.waitForSelector(".ec-filter__price-to .form-control__text");
        await page.type(".ec-filter__price-to .form-control__text", max, { delay: 100 }); 
    },15000);
    test("Поиск подходящих результатов", async ()=>{
         await page.keyboard.press('Enter'); 
    },15000);
    test("Проверка правельности результата", async ()=>{
        await page.waitForTimeout(8000);
        await page.waitForSelector(".ec-price-item");
        const items = await page.$$eval(".ec-price-item", (elements) => elements.map(el => el.innerText));
        const prices= items.map(price => price.replace("$",""));
        for(const price of prices) {
            const num = Number(price);
            expect (num >= Number(min) && num <= Number(max)).toBe(true);
         }
    },15000);
    });