import {dispatch,storeCaptures} from './service.js';
chrome.storage.local.setAccessLevel({accessLevel:'TRUSTED_CONTEXTS'});
chrome.runtime.onMessage.addListener((m,sender,respond)=>{dispatch(m,sender).then(value=>respond({ok:true,value}),e=>respond({ok:false,error:e.message}));return true;});
chrome.action.onClicked.addListener(async tab=>{
  let error='';
  try{
    if(!/^https?:\/\//.test(tab.url||'')||/^https?:\/\/(chromewebstore\.google\.com|chrome\.google\.com)\//.test(tab.url))throw new Error('Chrome restricts this page. Open a normal HTTP(S) page containing a table.');
    await chrome.scripting.executeScript({target:{tabId:tab.id},files:['collector.js']});
    const [{result}]=await chrome.scripting.executeScript({target:{tabId:tab.id},func:()=>window.GHCollect()});
    await storeCaptures(result);
  }catch(e){error=e.message;}
  await chrome.tabs.create({url:chrome.runtime.getURL('workbench.html')+'?source='+tab.id+(error?'&error='+encodeURIComponent(error):'')});
});
