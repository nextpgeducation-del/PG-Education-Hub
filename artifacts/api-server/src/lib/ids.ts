export function generateStudentId(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `PGE${year}${rand}`;
}

export function generateAdmissionNumber(): string {
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `ADM${rand}`;
}

export function generateReceiptNumber(): string {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `RCPT${rand}`;
}
