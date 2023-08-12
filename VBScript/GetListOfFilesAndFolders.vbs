Dim fso, folder, files
Set fso = CreateObject("Scripting.FileSystemObject")

folder = "C:\path\to\folder"

Set files = fso.GetFolder(folder).Files

For Each file In files
    WScript.Echo file.Name
Next

Set folders = fso.GetFolder(folder).SubFolders

For Each folder In folders
    WScript.Echo folder.Name
Next
