// localstorage

const STORAGE_KEY = "oPlan2.nodeDisplaySettings"

const DEFAULT_SETTINGS = {
  showVendorModel: true,
  showName: true
}

export function getDisplaySettings() {

  const saved = localStorage.getItem(STORAGE_KEY)

  if (!saved) { return { ...DEFAULT_SETTINGS } }

  try {

    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(saved)
    }

  } catch {

    return { ...DEFAULT_SETTINGS }

  }
}

export function saveDisplaySettings(settings) {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(settings)
  )

}