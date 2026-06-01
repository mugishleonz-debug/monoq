<?php
declare(strict_types=1);

mb_language('Japanese');
mb_internal_encoding('UTF-8');
set_time_limit(25);
ini_set('default_socket_timeout', '10');

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /#contact', true, 302);
    exit;
}

$adminEmails = [
    'info@monoq.jp',
    'spmtg.nakayama@gmail.com',
];
$fromEmail = 'No-reply@monoq.jp';
$fromName = 'MonoQ';
$recaptchaSecret = getenv('RECAPTCHA_SECRET_KEY') ?: '6LdBbgYtAAAAABf--ZZrBdUGrrSnp0KaRIOGfFqV';

function post_value(string $key): string
{
    return trim((string)($_POST[$key] ?? ''));
}

function json_response(bool $ok, string $message, int $status = 200): void
{
    http_response_code($status);
    echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

function clean_header(string $value): string
{
    return str_replace(["\r", "\n"], '', $value);
}

function verify_recaptcha(string $secret, string $token, string $remoteIp): bool
{
    if ($secret === '' || $token === '') {
        return false;
    }

    $payload = http_build_query([
        'secret' => $secret,
        'response' => $token,
        'remoteip' => $remoteIp,
    ]);

    if (function_exists('curl_init')) {
        $ch = curl_init('https://www.google.com/recaptcha/api/siteverify');
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 8,
        ]);
        $response = curl_exec($ch);
        curl_close($ch);
    } else {
        $context = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
                'content' => $payload,
                'timeout' => 8,
            ],
        ]);
        $response = file_get_contents('https://www.google.com/recaptcha/api/siteverify', false, $context);
    }

    if ($response === false) {
        return false;
    }

    $result = json_decode($response, true);
    if (!is_array($result) || ($result['success'] ?? false) !== true) {
        return false;
    }

    if (isset($result['action']) && $result['action'] !== 'contact') {
        return false;
    }

    if (isset($result['score']) && (float)$result['score'] < 0.5) {
        return false;
    }

    return true;
}

$company = post_value('company');
$name = post_value('name');
$tel = post_value('tel');
$email = post_value('email');
$message = post_value('message');
$privacy = post_value('privacy');
$honeypot = post_value('website');
$recaptchaToken = post_value('g-recaptcha-response');
$ip = $_SERVER['REMOTE_ADDR'] ?? '';

if ($honeypot !== '') {
    json_response(true, 'お問い合わせを受け付けました。');
}

$errors = [];
if ($company === '') $errors[] = '法人名を入力してください。';
if ($name === '') $errors[] = '氏名を入力してください。';
if ($tel === '') $errors[] = '電話番号を入力してください。';
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'メールアドレスを正しく入力してください。';
if ($privacy !== '1') $errors[] = 'プライバシーポリシーへの同意が必要です。';

if ($errors !== []) {
    json_response(false, implode("\n", $errors), 422);
}

if (!verify_recaptcha($recaptchaSecret, $recaptchaToken, $ip)) {
    json_response(false, 'reCAPTCHA認証に失敗しました。時間をおいて再度お試しください。', 403);
}

$submittedAt = date('Y-m-d H:i:s');
$ua = $_SERVER['HTTP_USER_AGENT'] ?? '';

$adminSubject = '【MonoQ】Webサイトからお問い合わせがありました';
$adminBody = <<<BODY
MonoQ Webサイトからお問い合わせがありました。

【法人名】
{$company}

【氏名】
{$name}

【電話番号】
{$tel}

【メールアドレス】
{$email}

【お問い合わせ内容】
{$message}

---
送信日時: {$submittedAt}
IP: {$ip}
User Agent: {$ua}
BODY;

$userSubject = '【MonoQ】お問い合わせありがとうございます';
$userBody = <<<BODY
{$name} 様

このたびは、モノク株式会社へお問い合わせいただきありがとうございます。
以下の内容でお問い合わせを受け付けました。
内容を確認のうえ、担当者よりご連絡いたします。

【法人名】
{$company}

【氏名】
{$name}

【電話番号】
{$tel}

【メールアドレス】
{$email}

【お問い合わせ内容】
{$message}

---
モノク株式会社
〒541-0054
大阪府大阪市中央区南本町2丁目3-12 EDGE本町3F
TEL: 06-7878-6131
Mail: info@monoq.jp
BODY;

$encodedFromName = mb_encode_mimeheader($fromName, 'UTF-8');
$safeFrom = clean_header($fromEmail);
$safeReplyTo = clean_header($email);
$sendmailParam = '-f ' . $safeFrom;

$adminHeaders = [
    "From: {$encodedFromName} <{$safeFrom}>",
    "Reply-To: {$safeReplyTo}",
    "Return-Path: {$safeFrom}",
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
];

$userHeaders = [
    "From: {$encodedFromName} <{$safeFrom}>",
    "Reply-To: {$safeFrom}",
    "Return-Path: {$safeFrom}",
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
];

$sentAdmin = true;
foreach ($adminEmails as $adminEmail) {
    $sentAdmin = mb_send_mail($adminEmail, $adminSubject, $adminBody, implode("\r\n", $adminHeaders), $sendmailParam) && $sentAdmin;
}
$sentUser = mb_send_mail($email, $userSubject, $userBody, implode("\r\n", $userHeaders), $sendmailParam);

if (!$sentAdmin) {
    json_response(false, '送信に失敗しました。時間をおいて再度お試しください。', 500);
}

if (!$sentUser) {
    json_response(false, '受付メールの送信に失敗しました。時間をおいて再度お試しください。', 500);
}

json_response(true, 'お問い合わせを受け付けました。');
