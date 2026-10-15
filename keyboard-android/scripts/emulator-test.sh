#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p build/qa
adb install -r app/build/outputs/apk/debug/app-debug.apk
adb install -r app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk
adb shell ime enable world.khalsa.keyboard/.PunjabiKeyboardService
adb shell ime set world.khalsa.keyboard/.PunjabiKeyboardService
adb shell am instrument -w world.khalsa.keyboard.test/world.khalsa.keyboard.KeyboardSmokeTest | tee build/qa/instrumentation.txt
for name in keyboard-punjabi keyboard-english keyboard-failure; do
  if adb shell run-as world.khalsa.keyboard test -f "files/$name.png"; then
    adb exec-out run-as world.khalsa.keyboard cat "files/$name.png" > "build/qa/$name.png"
  fi
done
python3 - <<'PY'
from pathlib import Path
result = Path('build/qa/instrumentation.txt').read_text()
assert 'PASS:' in result and 'FAIL:' not in result and 'INSTRUMENTATION_CODE: -1' in result, result
PY
