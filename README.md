# 工具说明
>### utils
>##### dealSql
>+	作用：根据表名和当前表的列名，生成对应的增删改查语句，基于mysql数据库。
>+ 输出一个函数，这个函数接收的有两个参数:table和fields,table是表名，fields是当前table的列名。需要对函数进行实例化，editSql是根据req,page和offset生成对应的增删改查语句。post,put,get,delete是node与mysql交互的函数，接受的参数是(connection, sql, req, res)
>+ 在modules/model.js调用了这个文件。在node中，直接require model.js文件，使用时输入table名就不用写增删改查语句了。

>##### monitor
>+ 作用：监控文件夹，保证文件夹中的文件是最新的n个，自动删除旧的文件。

>##### time
>+ 作用：根据时间戳生成中文时间，根据距当前时间的不同生成不同的中文。S = underscore.string.js

>##### upload
>+ 作用：后端上传文件功能，支持多文件上传。
