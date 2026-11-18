' 苍穹外卖 桌面版 - 静默启动（无控制台窗口）
Option Explicit
Dim sh, fso, base, java, jar, port
Set sh = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
base = fso.GetParentFolderName(WScript.ScriptFullName)
sh.CurrentDirectory = base
java = base & "\runtime\bin\javaw.exe"
jar = base & "\app\sky-take-out.jar"
If Not fso.FileExists(java) Then
  MsgBox "Bundled Java runtime not found.", 16, "Sky Take Out"
  WScript.Quit 1
End If
port = sh.Environment("PROCESS")("SKY_PORT")
If port = "" Then port = "8080"
sh.Run """" & java & """ -Xms128m -Xmx512m -Dfile.encoding=UTF-8 -Dspring.profiles.active=desktop -jar """ & jar & """ --server.port=" & port, 0, False
WScript.Sleep 13000
sh.Run "http://localhost:" & port & "/", 1, False
