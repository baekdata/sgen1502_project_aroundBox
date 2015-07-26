/*
	���� ���α׷� --- get_stems(), get_stems2() ȣ�� ���

	�Լ� get_stems(), get_stems2()�� ȣ���ϱ� ���� open_HAM_index()�� ȣ���ؾ� ��.
	<����> ������ ���� close_HAM_index()�� ȣ���ؾ� ��.

	2008�� 10�� 13�� ���½�
*/
package example;

import java.io.*;

public class test
{
	public static void main(String []args) {
		KLT2000JNI klt = new KLT2000JNI();
		String str = "�츮�� ���������� ������ ����� ��� �̶��� �¾��.";
		String [] terms = new String[1000];
		int i, n;
		BufferedReader br = new BufferedReader( new InputStreamReader(System.in) );
		String fname = "input.txt";

	// test 2.0 -- �ʱ�ȭ/���� �Լ��� 1ȸ�� ȣ���ϴ� ������� get_terms_file() ȣ�� ����
		if (klt.open_HAM_index() == 1)	// �ʱ�ȭ �Լ� -- ������ �� 1ȸ ȣ��
			System.out.println("ERROR -- open_HAM_index()\n");

		try {				
			System.out.print("�м��� ���ϸ� �Է� : ");
			fname = br.readLine();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		System.out.println("-----------------------------------------------");
		System.out.println("test 2.0 �Է�����");
		System.out.println(fname);
		System.out.println("-----------------------------------------------");
		klt.get_terms_file(fname, "output.txt");
		System.out.println("test 2.0 PASSED -- �м���� ���� <output.txt> ����\n");

		klt.close_HAM_index();	// ���� �Լ� -- �������� 1ȸ ȣ��

	// test 2.1 -- �ʱ�ȭ/���� �Լ��� 1ȸ�� ȣ���ϴ� ������� get_stems() ȣ�� ����
		if (klt.open_HAM_index() == 1)	// �ʱ�ȭ �Լ� -- ������ �� 1ȸ ȣ��
			System.out.println("ERROR -- open_HAM_index()\n");

		System.out.println("-----------------------------------------------");
		System.out.println("test 2.1 �Է¹���");
		System.out.println(str);
		System.out.println("-----------------------------------------------");
		for (i=0; i < 5; i++)	// 5ȸ �ݺ� ����
			System.out.println(klt.get_stems(str));
		System.out.println("test 2.1 PASSED\n");

		klt.close_HAM_index();	// ���� �Լ� -- �������� 1ȸ ȣ��

	// test 2.2 -- �ʱ�ȭ/���� �Լ��� 1ȸ�� ȣ���ϴ� ������� get_stems2() ȣ�� ����
		if (klt.open_HAM_index() == 1)	// �ʱ�ȭ �Լ� -- ������ �� 1ȸ ȣ��
			System.out.println("ERROR -- open_HAM_index()\n");

		System.out.println("-----------------------------------------------");
		System.out.println("test 2.2 �Է¹���");
		System.out.println(str);
		System.out.println("-----------------------------------------------");
		n = klt.get_stems2(str, terms);
		for (i = 0 ; i < n; i++) {	// n --> terms.length ����ϸ� �ȵ�.
			if( terms[i] != null )
				System.out.println(terms[i]);
		}
		System.out.println("test 2.2 PASSED\n");

	// test 2.3 -- get_stems2() ȣ�� ����(������ ���� �Է�)
		for (i=0; i < 2; i++) {
			try {				
				System.out.print("������ �Է��ϼ��� (quit for exit) : ");
				str = br.readLine();

				if( str.equalsIgnoreCase("quit") == true ) {
					System.out.println("�����մϴ�...");
					System.exit(1);
				}					

				System.out.println("-----------------------------------------------");
				System.out.println("test 2.3 �Է¹���");
				System.out.println(str);
				System.out.println("-----------------------------------------------");

				n = klt.get_stems2(str, terms);
				for (i = 0 ; i < n ; i++) {	// n --> terms.length ����ϸ� �ȵ�.
					if ( terms[i] != null )
						System.out.println(terms[i]);					
				}
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			System.out.println("test 2.3 PASSED\n");
		}
		klt.close_HAM_index();	// ���� �Լ� -- �������� 1ȸ ȣ��
	}
}     
