!macro customInstall
    WriteRegStr HKCU "Software\Classes\Directory\Background\shell\Photon" "" "Open Photon here"
    WriteRegStr HKCU "Software\Classes\Directory\Background\shell\Photon" "Icon" "$appExe"
    WriteRegStr HKCU "Software\Classes\Directory\Background\shell\Photon\command" "" `$appExe "%V"`

    WriteRegStr HKCU "Software\Classes\Directory\shell\Photon" "" "Open Photon here"
    WriteRegStr HKCU "Software\Classes\Directory\shell\Photon" "Icon" "$appExe"
    WriteRegStr HKCU "Software\Classes\Directory\shell\Photon\command" "" `$appExe "%V"`

    WriteRegStr HKCU "Software\Classes\Drive\shell\Photon" "" "Open Photon here"
    WriteRegStr HKCU "Software\Classes\Drive\shell\Photon" "Icon" "$appExe"
    WriteRegStr HKCU "Software\Classes\Drive\shell\Photon\command" "" `$appExe "%V"`
!macroend

!macro customUnInstall
  DeleteRegKey HKCU "Software\Classes\Directory\Background\shell\Photon"
  DeleteRegKey HKCU "Software\Classes\Directory\shell\Photon"
  DeleteRegKey HKCU "Software\Classes\Drive\shell\Photon"
!macroend
