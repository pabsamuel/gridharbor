/* GridHarbor collector. DOM helpers adapted from Copytables src/lib/dom.js,
   copyright 2014~present Georg Barikin, MIT. See LICENSE.
   Original: visible, toArray, textContentItems recursive walk and strip.
   Improvements: computed visibility, sensitive-control omission, nested table
   exclusion, rectangular span bounds, ARIA and explicit lists. */
(() => {
  const LIMIT = 100000;
  const toArray = coll => Array.prototype.slice.call(coll || [], 0);
  const strip = s => String(s || '').replace(/^\s+|\s+$/g, '');
  const visible = el => {
    if (!el || el.nodeType !== 1 || el.closest('[hidden],[aria-hidden="true"]')) return false;
    const css = getComputedStyle(el);
    return css.display !== 'none' && css.visibility !== 'hidden' && css.visibility !== 'collapse' && !!(el.offsetHeight || el.offsetWidth || el.getClientRects().length);
  };
  function textContentItems(node, table) {
    const c = [];
    function walk(n) {
      if (!n) return;
      if (n.nodeType === 3) { const t = strip(n.textContent); if (t.length) c.push(t); return; }
      if (n.nodeType !== 1 || !visible(n) || n.matches('input,textarea,select,button,script,style,[contenteditable],[autocomplete]')) return;
      if (table && n !== table && n.matches('table,[role="table"],[role="grid"]')) return;
      toArray(n.childNodes).forEach(walk);
    }
    walk(node);
    return strip(c.join(' ')).slice(0, 10000);
  }
  window.GHCollect = (options = {}) => {
    let nodes;
    if (options.selector) {
      if (typeof options.selector !== 'string' || options.selector.length > 250) throw new Error('List selector must be at most 250 characters.');
      nodes = toArray(document.querySelectorAll(options.selector)).filter(visible);
      if (nodes.some(n => n.closest('form,[contenteditable],address') || n.matches('input,textarea,select'))) throw new Error('Forms and contact addresses cannot be captured.');
      if (!nodes.length) throw new Error('No visible items match that list selector.');
      if (nodes.length > LIMIT) throw new Error('List exceeds the 100,000-cell safety limit. Narrow your selection.');
      if(nodes.length>=LIMIT)throw new Error('List plus header exceeds the 100,000-cell safety limit.');
      const rows=[['Item'], ...nodes.map(n => [textContentItems(n)])];
      if(rows.some(r=>r.some(v=>/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(v)))||nodes.some(n=>n.matches('a[href^="mailto:"],a[href^="tel:"]')||n.querySelector('a[href^="mailto:"],a[href^="tel:"]')))throw new Error('Contact information cannot be captured. Choose a non-contact list.');
      return [{label:'Selected list', rows, warnings:[]}];
    }
    nodes = toArray(document.querySelectorAll('table,[role="table"],[role="grid"]')).filter(n => visible(n) && !n.closest('form,address') && !n.parentElement?.closest('table,[role="table"],[role="grid"]'));
    let total = 0;
    const results = [];
    for (const tbl of nodes) {
      const isHTML = tbl.tagName === 'TABLE';
      const rows = (isHTML ? toArray(tbl.rows) : toArray(tbl.querySelectorAll('[role="row"]'))).filter(r => visible(r) && r.closest('table,[role="table"],[role="grid"]') === tbl);
      const matrix = [];
      let maxWidth = 0;
      for (let ri=0;ri<rows.length;ri++) {
        matrix[ri] ||= [];
        const cells = (isHTML ? toArray(rows[ri].cells) : toArray(rows[ri].querySelectorAll('[role="cell"],[role="gridcell"],[role="columnheader"],[role="rowheader"]'))).filter(visible);
        let ci = 0;
        for (const cell of cells) {
          while (matrix[ri][ci] !== undefined) ci++;
          const cs = Math.max(1, Number(cell.getAttribute(isHTML?'colspan':'aria-colspan')) || 1);
          const rawRS = cell.getAttribute(isHTML?'rowspan':'aria-rowspan');
          const rs = rawRS === '0' ? rows.length-ri : Math.max(1, Number(rawRS) || 1);
          if (!Number.isInteger(cs) || !Number.isInteger(rs) || cs > 1000 || rs > 10000 || (ci+cs)*Math.max(rows.length,ri+rs)>LIMIT) throw new Error('Merged table exceeds the 100,000-cell safety limit.');
          const text = textContentItems(cell, tbl);
          for (let y=ri;y<Math.min(rows.length,ri+rs);y++) {
            matrix[y] ||= [];
            for (let x=ci;x<ci+cs;x++) matrix[y][x]=text;
          }
          ci += cs;
        }
        maxWidth = Math.max(maxWidth, matrix[ri].length);
      }
      if (!maxWidth || !matrix.length) continue;
      total += maxWidth * matrix.length;
      if (total > LIMIT || results.length >= 100) throw new Error('Page exceeds the 100,000-cell / 100-table safety limit. Use a narrower page or list selector.');
      const rect = matrix.map(row => Array.from({length:maxWidth}, (_,i) => row[i] ?? ''));
      if(rect.some(r=>r.some(v=>/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(v)))||tbl.querySelector('a[href^="mailto:"],a[href^="tel:"]'))throw new Error('Contact information cannot be captured. Choose a non-contact page.');
      // Conservative directory guard: paired identity/contact column semantics,
      // not bare numeric values that would reject ordinary inventory tables.
      const headers=rect[0].map(v=>v.trim().toLocaleLowerCase('en').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' '));
      const identity=/^(full name|name|contact name|customer name|person|isim|ad|ad soyad|ad[?i] soyad[?i]|musteri ad[?i])$/;
      const contact=/^(phone|phone number|telephone|telephone number|mobile|mobile number|tel|email|e-mail|address|postal address|telefon|telefon numaras[?i]|cep telefonu|eposta|e-posta|adres)$/;
      if(rect.length>1&&headers.some(v=>identity.test(v))&&headers.some(v=>contact.test(v)))throw new Error('Contact directories cannot be captured. Choose a non-contact page.');
      if (!rect.some(row => row.some(Boolean))) continue;
      const label = strip(tbl.getAttribute('aria-label') || tbl.querySelector('caption')?.textContent || `Table ${results.length+1}`).slice(0,120);
      results.push({label,rows:rect,warnings: isHTML ? [] : ['Only rendered ARIA rows are captured. Virtualized or unloaded rows are not available.']});
    }
    if (!results.length) throw new Error('No visible tables found. Use the list selector for repeated items. Unloaded rows and cross-origin frames are not read.');
    return results;
  };
})();
