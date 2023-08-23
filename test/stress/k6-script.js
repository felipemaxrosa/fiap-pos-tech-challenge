import http from 'k6/http';

export default function () {
  let fnfSvc = __ENV.FAST_N_FOODIOUS_SVC || '127.0.0.1';
  http.get(`http://${fnfSvc}/v1/categoria`);
}