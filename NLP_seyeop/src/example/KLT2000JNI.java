package example;

public class KLT2000JNI {
	/**
	 * KLT2000 라이브러리로부터 색인어 추출 기능을 이용하여 자바에서 문장을 넘겼을 때 
	 * 추출된 색인어와 그 빈도수를 리턴하는 함수
	 * 
	 * @param sent		색인어를 추출할 문장
	 * @param terms	 	추출된 키워드 배열
	 */

// 아래 2개 함수는 함수 내에서 초기화(open_HAM_index), 종료(close_HAM_index)를 매번 호출하므로
// 실행이 매우 비효율적임 -- 가급적 사용하지 않는 게 좋음!!!
	public native String getstems(String sent);	// 초기화/종료 포함
	public native int getstems2(String sent, String [] terms);	// 초기화/종료 포함

// 위 2개 함수 대신에 아래 함수 get_stems(), get_stems2() 중에서 하나를 사용할 것!
// 이 함수들은 초기화 함수 open_HAM_index()를 호출한 이후에 사용해야 함
// 함수 사용이 끝났을 때 종료 함수 close_HAM_index()를 호출하여야 함!
	public native int open_HAM_index();	// initialize -- 사전 로딩 등
	public native void close_HAM_index();	// finalize -- release
	public native String get_stems(String sent);
	public native int get_stems2(String sent, String [] terms);

// 아래 함수는 get_terms_text()에 대한 파일단위 입출력임
	public native int get_terms_file(String input_file, String output_file);

	static {
		System.loadLibrary("KLT2000JNI");
	}
}
