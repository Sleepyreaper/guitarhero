// Enumerate microphone inputs. Device labels are only populated AFTER the user has
// granted mic permission once, so call this after a successful getUserMedia().
export async function listAudioInputs() {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return [];
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices
      .filter((d) => d.kind === 'audioinput')
      .map((d, i) => ({ deviceId: d.deviceId, label: d.label || `Microphone ${i + 1}` }));
  } catch {
    return [];
  }
}

// The deviceId actually in use by an active MediaStream (so the picker can preselect it).
export function activeDeviceId(stream) {
  try {
    return stream.getAudioTracks()[0].getSettings().deviceId || '';
  } catch {
    return '';
  }
}
