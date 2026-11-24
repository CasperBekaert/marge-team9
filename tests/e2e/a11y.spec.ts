import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
const pages=['/','/planning','/lessen','/examens','/methodes','/methodes/weekplanning','/fases/plannen','/afspraak','/project','/privacy']
for(const path of pages)test(`${path}: accessible and no page overflow`,async({page})=>{
 expect((await page.goto(path))?.status()).toBe(200)
 await expect(page.getByRole('heading',{level:1})).toBeVisible()
 const results=await new AxeBuilder({page}).analyze()
 expect(results.violations.filter(v=>['serious','critical'].includes(v.impact||'')).map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([])
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true)
})
test('keyboard opens the skip link',async({page})=>{await page.goto('/');await page.keyboard.press('Tab');await expect(page.getByRole('link',{name:'Ga naar de inhoud'})).toBeFocused()})
