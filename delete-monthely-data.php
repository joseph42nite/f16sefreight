<?php 
require_once('db-class.php');
$delete_wallet_transaction=$db->query("DELETE from wallet_transaction where created_on<='2023-12-02 23:59:59'");
echo $delete_wallet_transaction->rowCount()." number of data deleted from wallet_transaction<br>";

$delete_betmatch=$db->query("DELETE from betmatch where result_time<='2023-12-02 23:59:59'");
echo $delete_betmatch->rowCount()." number of data deleted from betmatch<br>";

$delete_cancelled_user_bet=$db->query("DELETE from cancelled_user_bet where created_on<='2023-12-02 23:59:59'");
echo $delete_cancelled_user_bet->rowCount()." number of data deleted from cancelled_user_bet<br>";

$delete_cancelled_user_session_bet=$db->query("DELETE from cancelled_user_session_bet where created_on<='2023-12-02 23:59:59'");
echo $delete_cancelled_user_session_bet->rowCount()." number of data deleted from cancelled_user_session_bet<br>";

$delete_ledger_book=$db->query("DELETE from ledger_book where created_on<='2023-12-02 23:59:59'");
echo $delete_ledger_book->rowCount()." number of data deleted from ledger_book<br>";

$delete_match_data=$db->query("DELETE from match_data where created_on<='2023-12-02 23:59:59'");
echo $delete_match_data->rowCount()." number of data deleted from match_data<br>";

$delete_match_toss=$db->query("DELETE from match_toss where created_on<='2023-12-02 23:59:59'");
echo $delete_match_toss->rowCount()." number of data deleted from match_toss<br>";

$delete_pdc_charge=$db->query("DELETE from pdc_charge where created_on<='2023-12-02 23:59:59'");
echo $delete_pdc_charge->rowCount()." number of data deleted from pdc_charge<br>";

$delete_session_ledger=$db->query("DELETE from session_ledger where created_on<='2023-12-02 23:59:59'");
echo $delete_session_ledger->rowCount()." number of data deleted from session_ledger<br>";

$delete_user_bet=$db->query("DELETE from user_bet where created_on<='2023-12-02 23:59:59'");
echo $delete_user_bet->rowCount()." number of data deleted from user_bet<br>";

$delete_user_session_bet=$db->query("DELETE from user_session_bet where created_on<='2023-12-02 23:59:59'");
echo $delete_user_session_bet->rowCount()." number of data deleted from user_session_bet<br>";

$delete_user_toss_bet=$db->query("DELETE from user_toss_bet where created_on<='2023-12-02 23:59:59'");
echo $delete_user_toss_bet->rowCount()." number of data deleted from user_toss_bet<br>";

