<?php
   header('Access-Control-Allow-Origin: *');
   header('Access-Control-Allow-Headers: *');
   header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
   //header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
    

    $data = json_decode(file_get_contents('php://input'), true);

    $mysqli = new mysqli("localhost","root","","todoreact");
    if ($mysqli -> connect_errno) {
        echo "Failed to connect to MySQL: " . $mysqli -> connect_error;
        exit();
     };

     if(!mysqli_num_rows(mysqli_query($mysqli,"SHOW TABLES LIKE 'todos'"))) {
        $sql = 'CREATE TABLE todos (
            ID int NOT NULL AUTO_INCREMENT,
            Task varchar(255) NOT NULL,
            Done boolean,
            PRIMARY KEY (ID))';
            $result = $mysqli -> query($sql);
      }

    if($_SERVER['REQUEST_METHOD'] == 'GET') {
        $result = $mysqli -> query("SELECT * FROM todos");
        $rows = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($rows);   
    }

    if($_SERVER['REQUEST_METHOD'] == 'DELETE') {
        $sql = "DELETE from `todos` WHERE `todos`.`ID` = ".$data['id'];            
        if ($result = $mysqli -> query($sql)) {
           echo json_encode($result);              
        }
    }
    
    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        if(!array_key_exists("id", $data)){
            //new task
            $sql = "INSERT INTO todos(task, done) VALUES ('".$data['task']."', false)";
            if ($result = $mysqli -> query($sql)) {
                echo json_encode($result);
              }
        }else{
            if(!array_key_exists("done",$data)){
                    // change task;
                    $sql = "UPDATE `todos` SET `Task` = '".$data['task']."' WHERE `todos`.`ID` = ".$data['id'];            
                    if ($result = $mysqli -> query($sql)) {
                       echo json_encode($result);
                    }               
            } else{
                // change done;
                $sql = "UPDATE `todos` SET `Done` = '".$data['done']."' WHERE `todos`.`ID` = ".$data['id'];            
                if ($result = $mysqli -> query($sql)) {
                    echo json_encode($result);
                  }
            }
        };
    }
    $mysqli -> close();

?>