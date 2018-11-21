REM Debug environment variables before ANT task runs
set PROVAR_sf_DemoAdmin=provardemo@provartesting.com
set PROVAR_sf_DemoAdmin_password=Testing123

reg query "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Uninstall\Google Chrome" /v DisplayVersion
reg query "HKEY_CLASSES_ROOT\Wow6432Node\CLSID{5C65F4B0-3651-4514-B207-D10CB699B14B}\LocalServer32" /v DisplayVersion
REM echo all settings
set
