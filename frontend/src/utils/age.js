function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function parseDob(value) {
  const trimmed = String(value || "").trim()
  if (!trimmed) return { error: "Please enter your date of birth as DD/MM/YYYY." }

  const match = trimmed.match(/^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{4})$/)
  if (!match) return { error: "Use DD/MM/YYYY, for example 15/08/1998." }

  const day = Number(match[1])
  const month = Number(match[2])
  const year = Number(match[3])

  if (month < 1 || month > 12) return { error: "Month must be between 01 and 12." }
  if (day < 1 || day > 31) return { error: "Day must be between 01 and 31." }
  if (year < 1800) return { error: "Please enter a realistic date of birth." }

  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return { error: "That date does not exist. Please check the day and month." }
  }

  const today = startOfDay(new Date())
  const dob = startOfDay(date)
  if (dob > today) return { error: "Date of birth cannot be in the future." }

  return { date: dob }
}

function nextBirthdayDate(birth, today) {
  const year = today.getFullYear()
  let next = safeBirthdayInYear(birth, year)
  if (startOfDay(next) < today) {
    next = safeBirthdayInYear(birth, year + 1)
  }
  return startOfDay(next)
}

function safeBirthdayInYear(birth, year) {
  const month = birth.getMonth()
  const day = birth.getDate()
  const candidate = new Date(year, month, day)
  if (candidate.getMonth() === month && candidate.getDate() === day) return candidate
  return new Date(year, month, day - 1)
}

export function calculateAge(dob, now = new Date()) {
  const today = startOfDay(now)
  const birth = startOfDay(dob)

  let years = today.getFullYear() - birth.getFullYear()
  let months = today.getMonth() - birth.getMonth()
  let days = today.getDate() - birth.getDate()

  if (days < 0) {
    months -= 1
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate()
  }

  if (months < 0) {
    years -= 1
    months += 12
  }

  const totalDays = Math.round((today - birth) / 86_400_000)
  const totalWeeks = Math.floor(totalDays / 7)
  const totalMonths = years * 12 + months
  const nextBirthday = nextBirthdayDate(birth, today)
  const daysUntil = Math.round((nextBirthday - today) / 86_400_000)

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    totalMonths,
    nextBirthday,
    daysUntil,
  }
}

export function formatLongDate(date) {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}
