const initConfig = {
  cookie: "appstarter_session={COOKIE_VALUE}",
  tahunAjar: { TAHUNAJAR },
};
function formatDateTime(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}
const sheet = SheetConn("Sheet1");
async function onPresensi() {
  sheet.deleteRows(2, 100);
  sheet.insertRowsAfter(2, 100);
  const resultMessage = {
    jadwal: "",
    dosenAmpu: "",
    dataPresensi: null,
    cookie: null,
    time: null,
  };
  const matkulResponse = await UrlFetchApp.fetch(
    `https://portalakademik-mhs.ulm.ac.id/Presensi/krsGrid/${initConfig.tahunAjar}`,
    {
      method: "GET",
      headers: {
        Cookie: initConfig.cookie,
      },
    }
  );
  const { data } = JSON.parse(matkulResponse.getContentText());

  data.forEach(async (element) => {
    const { id_kelas } = element;
    const pertemuanResponse = await UrlFetchApp.fetch(
      `https://portalakademik-mhs.ulm.ac.id/Presensi/presensiGrid/${id_kelas}`,
      {
        method: "GET",
        headers: {
          Cookie: initConfig.cookie,
        },
      }
    );
    const { data } = JSON.parse(pertemuanResponse.getContentText());

    if (data.length > 0) {
      data.forEach(async (element, index) => {
        const { kode_pertemuan, jenis_presensi, dosen_ampu } = element;
        resultMessage.jadwal = jenis_presensi;
        resultMessage.dosenAmpu = dosen_ampu;
        const formData = {
          kode_presensi: kode_pertemuan,
        };
        const doPresensiResponse = await UrlFetchApp.fetch(
          `https://portalakademik-mhs.ulm.ac.id/Presensi/buat_presensi`,
          {
            method: "POST",
            headers: {
              Cookie: initConfig.cookie,
            },
            payload: formData,
          }
        );

        const doPresensiData = JSON.parse(doPresensiResponse.getContentText());
        resultMessage.dataPresensi = doPresensiData;
        resultMessage.time = formatDateTime(new Date());
        let logText = `[${resultMessage.time}] - Jadwal : ${resultMessage.jadwal} - dosen : ${resultMessage.dosenAmpu} - status : `;
        var status = "";
        if (doPresensiData.code == 200) {
          logText += "Presensi Berhasil";
          status = "Presensi Berhasil";
        } else {
          logText += doPresensiData.message;
          status = doPresensiData.message;
        }
        const value = [
          [resultMessage.time, jenis_presensi, dosen_ampu, status],
        ];
        sheet
          .getRange(`A${sheet.getLastRow() + 1}:D${sheet.getLastRow() + 1}`)
          .setValues(value);
      });
    }
  });
}

function SheetConn(sheetName) {
  let strFileId = SpreadsheetApp.getActiveSpreadsheet().getId();
  let ss = SpreadsheetApp.openById(strFileId);
  let sheet = ss.getSheetByName(sheetName);
  return sheet;
}
