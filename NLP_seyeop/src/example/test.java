/*
	예제 프로그램 --- get_stems(), get_stems2() 호출 방법

	함수 get_stems(), get_stems2()를 호출하기 전에 open_HAM_index()를 호출해야 함.
	<주의> 종료할 때도 close_HAM_index()를 호출해야 함.

	2008년 10월 13일 강승식
*/
package example;

import java.io.*;

public class test
{
	public static void main(String []args) {
		KLT2000JNI klt = new KLT2000JNI();
		String str = "우리는 민족중흥의 역사적 사명을 띄고 이땅에 태어났다.";
		String [] terms = new String[1000];
		int i, n;
		BufferedReader br = new BufferedReader( new InputStreamReader(System.in) );
		String fname = "input.txt";

	// test 2.0 -- 초기화/종료 함수를 1회만 호출하는 방법으로 get_terms_file() 호출 예제
		if (klt.open_HAM_index() == 1)	// 초기화 함수 -- 시작할 때 1회 호출
			System.out.println("ERROR -- open_HAM_index()\n");

		try {				
			System.out.print("분석할 파일명 입력 : ");
			fname = br.readLine();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		System.out.println("-----------------------------------------------");
		System.out.println("test 2.0 입력파일");
		System.out.println(fname);
		System.out.println("-----------------------------------------------");
		klt.get_terms_file(fname, "output.txt");
		System.out.println("test 2.0 PASSED -- 분석결과 파일 <output.txt> 생성\n");

		klt.close_HAM_index();	// 종료 함수 -- 마지막에 1회 호출

	// test 2.1 -- 초기화/종료 함수를 1회만 호출하는 방법으로 get_stems() 호출 예제
		if (klt.open_HAM_index() == 1)	// 초기화 함수 -- 시작할 때 1회 호출
			System.out.println("ERROR -- open_HAM_index()\n");

		System.out.println("-----------------------------------------------");
		System.out.println("test 2.1 입력문장");
		System.out.println(str);
		System.out.println("-----------------------------------------------");
		for (i=0; i < 5; i++)	// 5회 반복 실행
			System.out.println(klt.get_stems(str));
		System.out.println("test 2.1 PASSED\n");

		klt.close_HAM_index();	// 종료 함수 -- 마지막에 1회 호출

	// test 2.2 -- 초기화/종료 함수를 1회만 호출하는 방법으로 get_stems2() 호출 예제
		if (klt.open_HAM_index() == 1)	// 초기화 함수 -- 시작할 때 1회 호출
			System.out.println("ERROR -- open_HAM_index()\n");

		System.out.println("-----------------------------------------------");
		System.out.println("test 2.2 입력문장");
		System.out.println(str);
		System.out.println("-----------------------------------------------");
		n = klt.get_stems2(str, terms);
		for (i = 0 ; i < n; i++) {	// n --> terms.length 사용하면 안됨.
			if( terms[i] != null )
				System.out.println(terms[i]);
		}
		System.out.println("test 2.2 PASSED\n");

	// test 2.3 -- get_stems2() 호출 예제(문장을 직접 입력)
		for (i=0; i < 2; i++) {
			try {				
				System.out.print("문장을 입력하세요 (quit for exit) : ");
				str = br.readLine();

				if( str.equalsIgnoreCase("quit") == true ) {
					System.out.println("종료합니다...");
					System.exit(1);
				}					

				System.out.println("-----------------------------------------------");
				System.out.println("test 2.3 입력문장");
				System.out.println(str);
				System.out.println("-----------------------------------------------");

				n = klt.get_stems2(str, terms);
				for (i = 0 ; i < n ; i++) {	// n --> terms.length 사용하면 안됨.
					if ( terms[i] != null )
						System.out.println(terms[i]);					
				}
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			System.out.println("test 2.3 PASSED\n");
		}
		klt.close_HAM_index();	// 종료 함수 -- 마지막에 1회 호출
	}
}     
