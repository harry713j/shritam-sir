export function formatDate(date: Date | undefined): string {
  if (typeof date === "undefined") {
    return "";
  }

  const currentDate = new Date(Date.now());
  const differenceTimeSecond = Math.floor(
    (currentDate.getTime() - date.getTime()) / 1000
  );
  let formattedValue = "";

  if (differenceTimeSecond < 60) {
    formattedValue += differenceTimeSecond + "s";
  } else if (differenceTimeSecond < 3600) {
    formattedValue += Math.floor(differenceTimeSecond / 60) + "min";
  } else if (differenceTimeSecond < 86400) {
    formattedValue += Math.floor(differenceTimeSecond / 3600) + "hours";
  } else {
    formattedValue += Math.floor(differenceTimeSecond / 86400) + "days";
  }

  return formattedValue;
}
