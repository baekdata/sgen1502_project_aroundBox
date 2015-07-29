package example;

public class KLT2000JNI {
	/**
	 * KLT2000 ���̺귯���κ��� ���ξ� ���� ����� �̿��Ͽ� �ڹٿ��� ������ �Ѱ��� �� 
	 * ����� ���ξ�� �� �󵵼��� �����ϴ� �Լ�
	 * 
	 * @param sent		���ξ ������ ����
	 * @param terms	 	����� Ű���� �迭
	 */

// �Ʒ� 2�� �Լ��� �Լ� ������ �ʱ�ȭ(open_HAM_index), ����(close_HAM_index)�� �Ź� ȣ���ϹǷ�
// ������ �ſ� ��ȿ������ -- ������ ������� �ʴ� �� ����!!!
	public native String getstems(String sent);	// �ʱ�ȭ/���� ����
	public native int getstems2(String sent, String [] terms);	// �ʱ�ȭ/���� ����

// �� 2�� �Լ� ��ſ� �Ʒ� �Լ� get_stems(), get_stems2() �߿��� �ϳ��� ����� ��!
// �� �Լ����� �ʱ�ȭ �Լ� open_HAM_index()�� ȣ���� ���Ŀ� ����ؾ� ��
// �Լ� ����� ������ �� ���� �Լ� close_HAM_index()�� ȣ���Ͽ��� ��!
	public native int open_HAM_index();	// initialize -- ���� �ε� ��
	public native void close_HAM_index();	// finalize -- release
	public native String get_stems(String sent);
	public native int get_stems2(String sent, String [] terms);

// �Ʒ� �Լ��� get_terms_text()�� ���� ���ϴ��� �������
	public native int get_terms_file(String input_file, String output_file);

	static {
		System.loadLibrary("KLT2000JNI");
	}
}
