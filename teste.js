var Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });


async function run(){
await nightmare
  .goto('https://duckduckgo.com')
  .type('#search_form_input_homepage', 'github nightmare')
  .click('#search_button_homepage')
  .wait('#r1-0 a.result__a')
  try {
   let a = await nightmare
  .evaluate(() => document.querySelector('#r1-0 a.result__a').href)
  console.log(a)
  } catch (error) {
      console.log(error)
  }
  await nightmare.goto('https://google.com')
   .wait(5000)
   .end()


}

run()