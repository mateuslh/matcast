export default function handler(_request, response) {
  response.setHeader('Cache-Control', 'no-store');
  response.status(200).json({
    status: 'offline',
    playlist: null,
    camera: null,
    startedAt: null,
    message: 'Transmissao ao vivo disponivel somente no servidor da academia'
  });
}
