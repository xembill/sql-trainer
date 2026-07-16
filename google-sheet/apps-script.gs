/**
 * Rana SQL Trainer — Dayı Gözlem Senkronu
 * --------------------------------------------------
 * Bu kodu Google E-Tablonun Alt+Enter (Extensions > Apps Script) menüsüne yapıştır,
 * "Dağıt > Yeni dağıtım > Web uygulaması" seç,
 *   - "Şu olarak çalıştır": Ben
 *   - "Erişimi olanlar": Herkes
 * ile yayınla. Aldığın /exec ile biten URL'i SQL Trainer'daki Gözlem Paneli
 * (Ctrl+Shift+G) → "Senkron" bölümüne yapıştır.
 *
 * Tablonda 3 sayfa oluşur:
 *   - Akis    : her gönderim bir satır (zaman çizelgesi + özet)
 *   - Dersler : ders bazında anlık süre/tamamlanma (her gönderimde tazelenir)
 *   - Hatalar : Rana'nın yanlış denemeleri (SQL + nedeni)
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  try { lock.waitLock(20000); } catch (err) {}
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var raw = (e && e.postData && e.postData.contents) || '';
    if (raw.indexOf('RANASQL:') === 0) raw = raw.substring(8);
    var d = JSON.parse(raw);

    writeAkis(ss, d);
    writeDersler(ss, d);
    writeHatalar(ss, d);

    return json({ ok: true, at: new Date() });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

function doGet() {
  return ContentService.createTextOutput('Rana SQL sync: alive')
    .setMimeType(ContentService.MimeType.TEXT);
}

function writeAkis(ss, d) {
  var sheet = ss.getSheetByName('Akis') || ss.insertSheet('Akis');
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, 12).setValues([['Zaman', 'Öğrenci', 'Tamamlanan', 'Başarı %', 'Çalıştırma', 'Kontrol', 'Doğru', 'İpucu', 'Çözüm', 'Süre (sn)', 'Sebep', 'Son hareketler']]);
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(12, 600);
  }
  var ev = d.events || [];
  var moves = ev.slice(-15).reverse().map(function (x) {
    var s = fmtClock(x.t) + ' ' + x.type;
    if (x.lesson) s += ' (' + x.lesson + ')';
    if (x.type === 'nav' && x.data) s += ' → ' + ((x.data.to || 0) + 1) + '. ders';
    if (x.type === 'check' && x.data) s += x.data.pass ? ' ✓' : ' ✗';
    if (x.type === 'query_run' && x.data) s += x.data.ok ? ' ✓' : ' ✗';
    return s;
  }).join(' | ');
  var row = [
    new Date(), d.student || 'Rana',
    (d.doneCount || 0) + '/' + (d.total || 0), (d.successRate || 0) + '%',
    d.totalRuns || 0, d.totalChecks || 0, d.totalPass || 0,
    d.totalHints || 0, d.totalSols || 0, Math.round((d.totalTime || 0) / 1000),
    d.sentReason || '-', moves
  ];
  sheet.appendRow(row);
  sheet.getRange(sheet.getLastRow(), 1).setNumberFormat('dd.MM.yyyy HH:mm:ss');
}

function writeDersler(ss, d) {
  var sheet = ss.getSheetByName('Dersler') || ss.insertSheet('Dersler');
  sheet.clear();
  var lessons = d.lessons || [];
  var rows = [['Ders', 'Süre (sn)', 'Tamamlandı']];
  lessons.forEach(function (l) {
    rows.push([l.title, Math.round(((d.times || {})[l.id] || 0) / 1000), (d.progress || {})[l.id] ? '✓' : '']);
  });
  sheet.getRange(1, 1, rows.length, 3).setValues(rows);
  sheet.setFrozenRows(1);
  sheet.setColumnWidth(1, 360);
}

function writeHatalar(ss, d) {
  var sheet = ss.getSheetByName('Hatalar') || ss.insertSheet('Hatalar');
  sheet.clear();
  var rows = [['Zaman', 'Ders', 'Yazılan SQL', 'Neden']];
  (d.events || []).forEach(function (x) {
    if (x.type === 'check' && x.data && !x.data.pass) {
      rows.push([fmtClock(x.t), x.lesson || '-', x.data.sql || '-', x.data.reason || '-']);
    }
  });
  if (rows.length === 1) rows.push(['—', 'Henüz yanlış deneme yok 🎉', '', '']);
  sheet.getRange(1, 1, rows.length, 4).setValues(rows);
  sheet.setFrozenRows(1);
  sheet.setColumnWidth(1, 130); sheet.setColumnWidth(2, 200);
  sheet.setColumnWidth(3, 480); sheet.setColumnWidth(4, 360);
}

function fmtClock(iso) {
  try { return Utilities.formatDate(new Date(iso), Session.getScriptTimeZone(), 'dd.MM HH:mm'); }
  catch (e) { return iso; }
}
function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
