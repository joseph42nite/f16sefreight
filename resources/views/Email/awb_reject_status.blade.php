<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <h4>Dear Partner,</h4>
    <p>This is to inform you that the following Air Waybill (<?= $awb_code - $awb_no  ?>) has been rejected, and an FNA (Freight Not Accepted) message has been received.</p>

    <span>AWB Number: <?= $awb_code - $awb_no  ?></span><br>
    <span>Origin: <?= $departure_airport ?></span><br>
    <span>Destination: <?= $destination_airport ?></span><br>
    <span>Total Volume: <?= $total_volume . " " . $dimention_unit ?></span><br>
    <span>Status: Rejected – FNA Received</span><br>
    <span>Error Details: <?= $reason ?></span><br>
    <span>Date & Time of Rejection: <?= $date_time ?></span><br>

    <p>Kindly review the above error details and take the necessary corrective action at the earliest. Once rectified, please resubmit the shipment details for further processing.
        For any clarification or operational assistance, please contact our team.
    </p>
    <br>
    Regards,<br>
    Operations Teambr<br>
    F16s E-Freight Solutions
</body>

</html>