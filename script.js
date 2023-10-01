const fs = require("fs");

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
async function onPresensi() {
  const resultMessage = {
    jadwal: "",
    dosenAmpu: "",
    dataPresensi: null,
    cookie: null,
    time: null,
  };
  const matkulResponse = await fetch(
    `https://portalakademik-mhs.ulm.ac.id/Presensi/krsGrid/${initConfig.tahunAjar}`,
    {
      method: "GET",
      headers: {
        Cookie: initConfig.cookie,
      },
    }
  );
  const { data } = await matkulResponse.json();

  const isNewCookie = matkulResponse.headers.get("Set-Cookie");
  if (isNewCookie) {
    const newCookieValue = isNewCookie.split(";")[0];
    resultMessage.cookie = newCookieValue;
    initConfig.cookie = newCookieValue;
  }

  data.forEach(async (element) => {
    const { id_kelas } = element;
    const pertemuanResponse = await fetch(
      `https://portalakademik-mhs.ulm.ac.id/Presensi/presensiGrid/${id_kelas}`,
      {
        method: "GET",
        headers: {
          Cookie: initConfig.cookie,
        },
      }
    );

    const { data } = await pertemuanResponse.json();
    if (data.length > 0) {
      data.forEach(async (element) => {
        const { kode_pertemuan, jenis_presensi, dosen_ampu } = element;
        resultMessage.jadwal = jenis_presensi;
        resultMessage.dosenAmpu = dosen_ampu;
        const formData = new FormData();
        formData.append("kode_presensi", kode_pertemuan);
        const doPresensiResponse = await fetch(
          `https://portalakademik-mhs.ulm.ac.id/Presensi/buat_presensi`,
          {
            method: "POST",
            headers: {
              Cookie: initConfig.cookie,
            },
            body: formData,
          }
        );

        const doPresensiData = await doPresensiResponse.json();
        resultMessage.dataPresensi = doPresensiData;
        resultMessage.time = formatDateTime(new Date());
        console.log(resultMessage);
        let logText = `[${resultMessage.time}] - Jadwal : ${resultMessage.jadwal} - dosen : ${resultMessage.dosenAmpu} - status : `;
        if (doPresensiData.code == 200) {
          logText += "Presensi Berhasil";
        } else {
          logText += doPresensiData.message;
        }
        fs.appendFile("log.txt", logText + "\n", (err) => {
          if (err) {
            console.error("Error writing to log file:", err);
          }
        });
      });
    }
  });
}
onPresensi();
const presensiInterval = setInterval(onPresensi, 5000);
